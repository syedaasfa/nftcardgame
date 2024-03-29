import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import { PageHOC, CustomInput, CustomButton } from "../components";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { contract, walletAddress, setShowAlert, gameData, setErrorMessage } = useGlobalContext();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();
  const handleClick = async () => {
    try {

      const playerExists = await contract.isPlayer(walletAddress);
      console.log(playerExists);

      if (!playerExists) {
        const reg = await contract.registerPlayer(playerName, playerName, {
          gasLimit: 200000
        });

        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is being summoned!`,
        });
      }
    } catch (error) {
       setErrorMessage(error)
    }
  };

  useEffect(() => {
    const createPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      if (playerExists && playerTokenExists) navigate('/create-battle');
    };

    if (contract) createPlayerToken();
  }, [contract]);

  useEffect(() => {
    if (gameData.activeBattle) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

  return (
    <div className="flex flex-col">
      <CustomInput
        label="Name"
        placeHolder="Enter your player name"
        value={playerName}
        handleValueChange={setPlayerName}
      />

      <CustomButton
        title="Register"
        handleClick={handleClick}
        restStyles="mt-6"
      />
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Card Chronicles <br /> a Web3 NFT Card Game
  </>,
  <>
    Connect your wallet to start playing <br /> the ultimate Web3 Battle Card
    Game
  </>
);
