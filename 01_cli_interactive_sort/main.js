#! /usr/bin/env node

const sortRepo = require('./sortingRepo')
const input = require("./input")

async function main(){

    let toggle = true

    while(toggle){

        let text = await input("Enter your text:")

        let data = text.trim().split(" ").filter(item => item != '')

        let type = await input("Choose operation:\n" +
                                    "   1 Sort words alphabetically\n" +
                                    "   2 Show numbers from lesser to greater\n" +
                                    "   3 Show numbers from bigger to smaller\n" +
                                    "   4 Display words in ascending order by number of letters in the word\n" +
                                    "   5 Show only unique words\n" +
                                    "   6 Display only unique values from the set of words and numbers\n" +
                                    "   To exit the program, type \"exit\"\n")

        switch (type) {
            case "1":
                console.log(sortRepo.sortAlphabetically(data))
                break;
            case "2":
                console.log(sortRepo.sortNumsAsc(data))
                break;
            case "3":
                console.log(sortRepo.sortNumsDesc(data))
                break;
            case "4":
                console.log(sortRepo.sortWordsAsc(data))
                break;
            case "5":
                console.log(sortRepo.UniqueWords(data))
                break;
            case "6":
                console.log(sortRepo.UniqueValues(data))
                break;
            case "exit":
                console.log("Goodbye!")
                toggle = false
                break;
            default:
                console.log("Wrong input!")
                break;
        }
    }
}

main()