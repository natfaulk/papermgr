# Paper Manager

A basic paper manager to organise journal articles and the like. I don't like endnote, or any other paper management software I've tried, so I decided to make my own. It is very much a work in progress and therefore is slightly buggy, doesn't yet implement all the error checking it should and the UI looks horrendous (partly due to making it easier to sort out the layout by having contrasting colours everywhere).

I have tried to make it so the save files are portable as possible. One can just store the data file and the pdfs in a shared location ie onedrive and then access them on multiple computers through the app and it just works. Eventually might add saving to server.

The software is written in JS, uses AngularJS for templating and uses electron to run as a pc app.

## To run
- Clone the repo `git clone `
- Create a settings.json file (modify the settings.example.json file) - eventually I will get around to the app automating this
- Download the dependencies `npm install`
- Run with `npm start`

## Current features
- Add pdf files and citation in RefMan format (.ris file, easy to download from google scholar)
- Display PDF in central pane, can add notes and tags and set whether paper read or not in right pane
- saves to json file

## Features to be implemented
- Make the UI pretty
- Sanitise iputs and proper error checking, especially on file loading
- Auto suggest tags when typing (eg so dont get WiFi anf wifi and wi-fi as 3 seperate tags)
- Sort papers by date added, tag, date read, author etc
- If no settings file found, prompt for directories to be used
- Get references from papers and interactively show which papers refernce which
- Scrape info automatically and not need to download citation
- Potentially use mongo or another database instead of a json file for saving