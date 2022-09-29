'use strict'
;(function()
{
    window.SC = {};

    SC.PreSave = {};
    SC.PostSave = {};
    SC.dungeonName = "";
    SC.playerLevel = 0;
    SC.dutyClearFailed = true;
    SC.Both = false;
    SC.PlayerLevel = 60;


    SC.PopulateDungeonDropdown = function()
    {
        let dungeonDropDown = document.getElementById("DeepDungeon");

        let potdOption = document.createElement("option");
        potdOption.text = "Palace of the Dead";
        let hohOption = document.createElement("option");
        hohOption.text = "Heaven-on-High";
        dungeonDropDown.add(potdOption, dungeonDropDown[0]);
        dungeonDropDown.add(hohOption, dungeonDropDown[1]);
    }

    SC.DungeonSelected = function(index, value)
    {
        SC.ClearSaves();
        SC.HideAll();
        SC.ClearAllInputs();
        SC.ClearDropdown(document.getElementById("FloorSelection"), "Select Floor Range");

        SC.dungeonName = value;
        SC.PlayerLevel = value == "Palace of the Dead" ? 60 : 70;

        let floorDropDown = document.getElementById("FloorSelection");
        
        let x = document.createElement("option");
        x.text = value == "Palace of the Dead" ? "Floors 1-100" : "Floors 1-30";
        x.value = x.text;
        floorDropDown.add(x);
        let y = document.createElement("option");
        y.text = value == "Palace of the Dead" ? "Floors 1-200" : "Floors 1-100";
        y.value = y.text;
        floorDropDown.add(y);
        let z = document.createElement("option");
        z.text = "Both";
        z.value = z.text;
        floorDropDown.add(z);

        floorDropDown.classList.remove('hide');
    }

    SC.FloorSelected = function(index, value)
    {
        SC.ClearSaves();
        SC.ClearAllInputs();

        SC.PreSave.deepDungeonName = SC.dungeonName;
        SC.PostSave.deepDungeonName = SC.dungeonName;

        switch(value)
        {
            case "Floors 1-30":
                {
                    SC.Both = false;
                    SC.PreSave.floorStoppedOn = 30;
                    SC.ShowByClass("hidehoh");
                    document.getElementById("hoh30").classList.remove('hide');
                    document.getElementById("hoh100").classList.add('hide');
                    break;
                }
            case "Floors 1-100":
                {
                    if (SC.dungeonName == "Palace of the Dead")
                    {
                        SC.Both = false;
                        SC.PreSave.floorStoppedOn = 100;
                        SC.ShowByClass("hidepotd");
                        document.getElementById("potd100").classList.remove('hide');
                        document.getElementById("potd200").classList.add('hide');
                    }
                    else if (SC.dungeonName == "Heaven-on-High")
                    {
                        SC.Both = true;
                        SC.PreSave.floorStoppedOn = 30;
                        SC.PostSave.floorStoppedOn = 100;
                        SC.HideByClass("hidehoh");
                        document.getElementById("hoh30").classList.remove('hide');
                        document.getElementById("hoh100").classList.remove('hide');
                    }
                    break;
                }
            case "Floors 1-200":
                {
                    SC.Both = true;
                    SC.PreSave.floorStoppedOn = 100;
                    SC.PostSave.floorStoppedOn = 200;
                    SC.HideByClass("hidepotd");
                    document.getElementById("potd100").classList.remove('hide');
                    document.getElementById("potd200").classList.remove('hide');
                    break;
                }
            case "Both":
                {
                    SC.Both = true;
                    if (SC.dungeonName == "Palace of the Dead")
                    {
                        SC.PreSave.floorStoppedOn = 100;
                        SC.PostSave.floorStoppedOn = 200;
                        SC.ShowByClass("hidepotd");
                        document.getElementById("potd100").classList.remove('hide');
                        document.getElementById("potd200").classList.remove('hide');
                    }
                    else if (SC.dungeonName == "Heaven-on-High")
                    {
                        SC.PreSave.floorStoppedOn = 30;
                        SC.PostSave.floorStoppedOn = 100;
                        SC.ShowByClass("hidehoh");
                        document.getElementById("hoh30").classList.remove('hide');
                        document.getElementById("hoh100").classList.remove('hide');
                    }
                    break;
                }
            default:
                break;
        }
        document.getElementById("maindivider").classList.remove("hide");
        SC.CalculateScore();
    }

    SC.HideAll = function()
    {
        document.getElementById("maindivider").classList.add("hide");
        document.getElementById("hoh30").classList.add("hide");
        document.getElementById("hoh100").classList.add("hide");
        document.getElementById("potd100").classList.add("hide");
        document.getElementById("potd200").classList.add("hide");
        document.getElementById("FloorSelection").classList.add("hide");
    }

    SC.ClearAllInputs = function()
    {
        let inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; ++i)
        {
            inputs[i].value = 0;
        }        
    }

    SC.ClearDropdown = function(element, defaultValue)
    {
        var i, L = element.options.length - 1;
        for(i = L; i >= 0; i--) {
            element.remove(i);
        }         
        var option = document.createElement("option");
        option.text = defaultValue;
        option.selected = true;
        option.disabled = true;
        option.hidden = true;
        option.value = 0;
        element.add(option);
    }

    SC.ClearSaves = function()
    {
        SC.PreSave = {};
        SC.PreSave.floorStartedOn = 1;
        SC.PreSave.floorStoppedOn = 1;
        SC.PreSave.deepDungeonName = "";
        SC.PreSave.currentChestCount = 0;
        SC.PreSave.currentSpecialKillCount = 0;
        SC.PreSave.currentTrapsTriggered = 0;
        SC.PreSave.currentEnchantmentCount = 0;
        SC.PreSave.currentSpeedRunBonusCount = 0;
        SC.PreSave.currentRezCount = 0;
        SC.PreSave.currentSpecialKillCountPre = 0;
        SC.PreSave.mimicCountPre = 0;
        SC.PreSave.killCountPre = 0;
        SC.PreSave.mimicCount = 0;
        SC.PreSave.killCount = 0;

        SC.PostSave = {};
        SC.PostSave.floorStartedOn = 1;
        SC.PostSave.floorStoppedOn = 1;
        SC.PostSave.deepDungeonName = "";
        SC.PostSave.currentChestCount = 0;
        SC.PostSave.currentTrapsTriggered = 0;
        SC.PostSave.currentEnchantmentCount = 0;
        SC.PostSave.currentSpeedRunBonusCount = 0;
        SC.PostSave.currentRezCount = 0;
        SC.PostSave.currentSpecialKillCount = 0;
        SC.PostSave.currentSpecialKillCountPre = 0;
        SC.PostSave.mimicCountPre = 0;
        SC.PostSave.killCountPre = 0;
        SC.PostSave.mimicCount = 0;
        SC.PostSave.killCount = 0;
    }
    SC.Update = function(data, value)
    {
        let source = data.split('|')
        if (source[2].includes('kills') || source[2].includes('mimics') || source[2].includes('rare'))
        {
            if (source[0] == "pre")
            {
                SC.PreSave[source[1]] = parseInt(value);
                SC.PostSave[source[1] + 'Pre'] = parseInt(value);
            }
            
            if (source[0] == "post")
            {
                SC.PostSave[source[1]] = parseInt(value);
            }
        }
        else
        {
            if (source[0] == "pre")
                SC.PreSave[source[1]] = parseInt(value);
                
            SC.PostSave[source[1]] = parseInt(value) + parseInt(document.getElementById(source[2]).value);
        }

        SC.CalculateScore();
    }   
    SC.CalculateScore = function()
    {
        let letPreScoreText = SC.dungeonName == "Palace of the Dead" ? document.getElementById("potd100score") : document.getElementById("hoh30score");
        letPreScoreText.innerHTML = SC.ScoreCalculator.CalculateCurrentScore(SC.PreSave, SC.PlayerLevel, 101).toLocaleString();
        if (SC.Both)
        {
            let letPostScoreText = SC.dungeonName == "Palace of the Dead" ? document.getElementById("potd200score") : document.getElementById("hoh100score");
            letPostScoreText.innerHTML = SC.ScoreCalculator.CalculateCurrentScore(SC.PostSave, SC.PlayerLevel, 101).toLocaleString();
        }
    }

    SC.HideByClass = function(className)
    {
        let elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++)
        {
            elements[i].classList.add('hide');
        }
    }
    SC.ShowByClass = function(className)
    {
        let elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++)
        {
            elements[i].classList.remove('hide');
        }
    }
    

})()