'use strict'

;(function(){

    SC.ScoreCalculator = {};

    SC.ScoreCalculator.firstFloorTimeOut = false; // This is likely never going to change but there is an odd score difference if you timeout or die on the first set before revealing two floors.  Not relevant for actual score runs.

    SC.ScoreCalculator.aetherpoolArm = 99; // Assuming full aetherpool
    SC.ScoreCalculator.aetherpoolArmor = 99; // Assuming full aetherpool 

    SC.ScoreCalculator.characterLevelScore = 0;
    SC.ScoreCalculator.floorScore = 0;
    SC.ScoreCalculator.revealedScore = 0;
    SC.ScoreCalculator.chestScore = 0;
    SC.ScoreCalculator.uniqueEnemyScore = 0;
    SC.ScoreCalculator.mimicScore = 0;
    SC.ScoreCalculator.enchantmentScore = 0;
    SC.ScoreCalculator.trapScore = 0;
    SC.ScoreCalculator.speedRunScore = 0;
    SC.ScoreCalculator.rezScore = 0;
    SC.ScoreCalculator.killScore = 0;
    
    SC.ScoreCalculator.CalculateCurrentScore = function(saveFile, playerLevel, dutyClearFailed)
    {
        let score = 0;

        let floorStoppedOn = saveFile.floorStoppedOn;
        let totalPossibleMapReveals = (floorStoppedOn - saveFile.floorStartedOn + 1) - (Math.floor((floorStoppedOn - saveFile.floorStartedOn + 1) / 10));

        SC.ScoreCalculator.characterLevelScore = ((SC.ScoreCalculator.aetherpoolArm + SC.ScoreCalculator.aetherpoolArmor) * 10) + (playerLevel * 500);
        SC.ScoreCalculator.floorScore = SC.ScoreCalculator.CalculateFloorScore(saveFile.floorStartedOn, floorStoppedOn, dutyClearFailed, saveFile.deepDungeonName);
        SC.ScoreCalculator.revealedScore = SC.ScoreCalculator.CalculateFullyRevealedFloorScore(saveFile.floorStartedOn, floorStoppedOn,  totalPossibleMapReveals, dutyClearFailed);
        SC.ScoreCalculator.chestScore = SC.ScoreCalculator.CalculateChestScore(saveFile.currentChestCount, dutyClearFailed);
        SC.ScoreCalculator.uniqueEnemyScore = SC.ScoreCalculator.CalculateUniqueEnemyScore(saveFile.currentSpecialKillCount + saveFile.currentSpecialKillCountPre, dutyClearFailed);
        SC.ScoreCalculator.mimicScore = SC.ScoreCalculator.CalculateMimicKorriganScore(saveFile.mimicCount + saveFile.mimicCountPre, dutyClearFailed);
        SC.ScoreCalculator.enchantmentScore = SC.ScoreCalculator.CalculateEnchantmentScore(saveFile.currentEnchantmentCount, dutyClearFailed);
        SC.ScoreCalculator.trapScore = SC.ScoreCalculator.CalculateTrapScore(saveFile.currentTrapsTriggered, dutyClearFailed);
        SC.ScoreCalculator.speedRunScore = SC.ScoreCalculator.CalculateSpeedRunScore(saveFile.currentSpeedRunBonusCount, dutyClearFailed);
        SC.ScoreCalculator.rezScore = SC.ScoreCalculator.CalculateRezScore(saveFile.currentRezCount, dutyClearFailed);

        let temp = SC.ScoreCalculator.revealedScore +
                   SC.ScoreCalculator.chestScore +
                   SC.ScoreCalculator.uniqueEnemyScore +
                   SC.ScoreCalculator.mimicScore +
                   SC.ScoreCalculator.enchantmentScore +
                   SC.ScoreCalculator.trapScore +
                   SC.ScoreCalculator.speedRunScore +
                   SC.ScoreCalculator.rezScore;

        if (temp / dutyClearFailed > 0)
            score += SC.ScoreCalculator.characterLevelScore + SC.ScoreCalculator.floorScore + temp;
        else
            score += SC.ScoreCalculator.characterLevelScore + SC.ScoreCalculator.floorScore;

        SC.ScoreCalculator.killScore = SC.ScoreCalculator.CalculateKillScore(saveFile.floorStartedOn, floorStoppedOn, saveFile.killCount, saveFile.killCountPre, saveFile.mimicCount, saveFile.currentSpecialKillCount, saveFile.deepDungeonName);

        score += SC.ScoreCalculator.killScore;

        return score;
    }


    SC.ScoreCalculator.CalculateFloorScore = function(floorStartedOn, currentFloorNumber, dutyClearFailed, deepDungeonName)
    {
        let score = 0;
        let floorDifference = currentFloorNumber - floorStartedOn;
        let lastBossFloorCompleted =  Math.floor((currentFloorNumber - floorStartedOn) / 10);

        score += 430 * floorDifference; // Aetherpool(99/99 assumed) times floor ended on minus floor started on

        score += (currentFloorNumber - (floorStartedOn + lastBossFloorCompleted)) * 50 * 91; // Score bonus for getting to each floor(minus bosses?)
        // 409, 500 for Hoh, 819,000 for potd

        score += lastBossFloorCompleted * dutyClearFailed * 300;  //multiplier for each boss (minimum 300, some are worth more/less, adjusted further down)
        // 227,250 for HoH, 479,750 for potd

        // floor 100 scoreboard bandaid; only applicable if starting at 1
        if (floorDifference + 1 == 100 && dutyClearFailed == 101)
        score -= 4500;

        if (deepDungeonName == 'Heaven-on-High')
        {
            // Give bonus for floor 30 boss
            if (currentFloorNumber == 30){
                score += dutyClearFailed * 300;
            }

            // 5050 bonus for reaching last floor (separate from completion bonus.  You get this if you timeout on last floor rip)
            if (currentFloorNumber == 100){
                score += 50 * dutyClearFailed;
            }
            
            // adding additional 450 for floor 30 boss
            // removing 50 for first boss (weather thats floor 10 or 30)
            score += 400 * dutyClearFailed;

            // Floor 30 scoreboard bandaid; only applicable if starting at 1
            if (floorDifference + 1 == 30)
                score -= 1000;

            // Clear bonus
            if (currentFloorNumber == 100)
                score += 3200 * dutyClearFailed;
        }


        if (deepDungeonName == 'Palace of the Dead')
        {
            // Give base bonus for floor 100 boss
            if (currentFloorNumber == 100){
                score += dutyClearFailed * 300;
            }

            // 5050 bonus for reaching last floor (separate from completion bonus.  You get this if you timeout on last floor rip)
            if (currentFloorNumber == 200){
                score += 50 * dutyClearFailed;
            }
            
            // removing 50 for first boss (weather thats floor 10 or 60)
            score -= 50 * dutyClearFailed;

            // Floor 50 boss bonus
            if (floorStartedOn == 1)
                score += 450 * dutyClearFailed;
            // Floor 100 boss bonus
            score += 450 * dutyClearFailed;

            // 2000 point deduction for starting floor 51
            if (floorStartedOn == 51)
                score -= 2000;
            
            // Clear bonus
            if (currentFloorNumber == 200)
            {
                if (floorDifference + 1 == 200)
                    score += -9500 + 3200 * dutyClearFailed;
                if (floorDifference + 1 == 150)
                    score += -7000 + 3200 * dutyClearFailed;
            }
        }        
        
        return score;
    }

    SC.ScoreCalculator.CalculateFullyRevealedFloorScore = function(floorStartedOn, currentFloorNumber, fullyRevealedFloors, dutyClearFailed){
        let score = 0;
        if (!SC.ScoreCalculator.firstFloorTimeOut)
        {
            if (currentFloorNumber - floorStartedOn + 1 > 10)
                score += dutyClearFailed * fullyRevealedFloors * 25;
            else
            {
                if (dutyClearFailed == 101)
                    score += dutyClearFailed * fullyRevealedFloors * 25;
                else
                    score += dutyClearFailed * (fullyRevealedFloors - 2) * 25;
            }
        }
        return score;
    }

    SC.ScoreCalculator.CalculateChestScore = function(chestCount, dutyClearFailed){
        let score = 0;
        if (!SC.ScoreCalculator.firstFloorTimeOut)
        {
            score += chestCount * dutyClearFailed;
        }
        return score;
    }

    SC.ScoreCalculator.CalculateUniqueEnemyScore = function(uniqueCount, dutyClearFailed){
        let score = 0;
        if (!SC.ScoreCalculator.firstFloorTimeOut)
        {
            score += uniqueCount * dutyClearFailed * 20;
        }
        return score;
    }

    SC.ScoreCalculator.CalculateMimicKorriganScore = function(enemyCount, dutyClearFailed){
        let score = 0;
        if (!SC.ScoreCalculator.firstFloorTimeOut)
        {
            score += enemyCount * dutyClearFailed * 5;
        }
        return score;
    }

    SC.ScoreCalculator.CalculateEnchantmentScore = function(enchantmentCount, dutyClearFailed){
        let score = 0;
        if (!SC.ScoreCalculator.firstFloorTimeOut)
        {
            score += enchantmentCount * dutyClearFailed * 5;
        }
        return score;
    }

    SC.ScoreCalculator.CalculateTrapScore = function(trapCount, dutyClearFailed){
        let score = 0;
        if (!SC.ScoreCalculator.firstFloorTimeOut)
        {
            score += -trapCount * dutyClearFailed * 2;
        }
        return score;
    }

    SC.ScoreCalculator.CalculateSpeedRunScore = function(currentSpeedRunBonusCount, dutyClearFailed){
        let score = 0;
        if (!SC.ScoreCalculator.firstFloorTimeOut)
        {
            score += currentSpeedRunBonusCount * dutyClearFailed * 150;
        }
        return score;
    }

    SC.ScoreCalculator.CalculateRezScore = function(rezCount, dutyClearFailed){
        let score = 0;
        if (!SC.ScoreCalculator.firstFloorTimeOut)
        {
            score += -rezCount * dutyClearFailed * 50;
        }
        return score;
    }
    
    SC.ScoreCalculator.CalculateKillScore = function(floorStartedOn, currentFloorNumber, killCount, killCountPre, mimicCount, rareKillCount, deepDungeonName){
        let score = 0;

        // HoH floor 1-30 are normal kill values
        // HoH floor 31-100 are bonus kill values excluding mimics and bosses
        if (deepDungeonName == 'Heaven-on-High'){
            if (currentFloorNumber == 30){
                score += (100 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2)) * 2) * killCount;
            }
            else{
                let nonBonusMobs = mimicCount + 6;
                score += (100 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2)) * 2) * killCountPre;
                score += (100 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2)) * 2) * (nonBonusMobs);
                score += (201 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2)) * 2) * (killCount - nonBonusMobs);
            }
     
        }
        
        // Potd floor 1-100 are normal kill values
        // Potd floor 101-200 are bonus kill values excluding mimics, rare monsters, and bosses
        if (deepDungeonName == 'Palace of the Dead')
        {
            if (currentFloorNumber == 100){
                //score += (100 + (Math.floor((currentFloorNumber - floorStartedOn + 1) / 2))) * killCount;                
                score += 150 * killCount; 
            }
            else{
                let nonBonusMobs = mimicCount + rareKillCount + 9;
                //score += (100 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2))) * killCountPre;
                //score += (100 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2))) * (nonBonusMobs);
                //score += (201 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2))) * (killCount - nonBonusMobs);
                score += 200 * killCountPre;
                score += 200 * nonBonusMobs;
                score += 301 * (killCount - nonBonusMobs);
            }
        }
        return score;
    }

    SC.ScoreCalculator.CalculateRoomRevealEstimate = function(roomRevealCounts, deepDungeonName){
        let score = 0;

        let floorSetIndex = Math.floor(SC.currentFloor / 10);
        if (deepDungeonName == 'Heaven-on-High'){
            let range = SC.RoomRangesHOH[floorSetIndex].split(':').map(Number);
            for (var i = 0; i < 10; i++){
                score += roomRevealCounts[i] * range[2];
            }
        }
        else
        {
            let range = SC.RoomRangesPOTD[floorSetIndex].split(':').map(Number);
            for (var i = 0; i < 20; i++){
                score += roomRevealCounts[i] * range[2];
            }  
        }
        return score;
    }

    SC.ScoreCalculator.CalculateMaxRoomReveal = function(currentSave, dutyClearFailed){
        let score = 0;
        let mapRevealsEarned = currentSave.currentMapRevealCount;
        let totalPossibleMapReveals = (currentSave.floorMaxScore - currentSave.floorStartedOn + 1) - (Math.floor((currentSave.floorMaxScore - currentSave.floorStartedOn + 1) / 10));

        let mapRevealsToAdd = totalPossibleMapReveals - mapRevealsEarned;

        return  dutyClearFailed * mapRevealsToAdd * 25;
    }

})()