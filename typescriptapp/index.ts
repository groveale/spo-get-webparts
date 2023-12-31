import * as readline from 'readline-sync';
import { Site } from '@microsoft/microsoft-graph-types';

import * as graphHelper from './graphHelper.ts';

import settings, { AppSettings } from './appSettings';

async function main() {
    console.log('TypeScript Graph Tutorial');

    let choice = 0;

    // Initialize Graph
    initializeGraph(settings);

    const choices = [
        'Display access token',
        'List all sites',
        'List webparts on sites'
    ];

    // Generate a timestamp for the file name
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '');

    // Specify the file path with the timestamp
    const fileName = `WebPartsInSite_${timestamp}.csv`;
    const filePath = fileName;

    while (choice != -1) {
        choice = readline.keyInSelect(choices, 'Select an option', { cancel: 'Exit' });

        switch (choice) {
            case -1:
                // Exit
                console.log('Goodbye...');
                break;
            case 0:
                // Display access token
                await displayAccessTokenAsync();
                break;
            case 1:
                // List users
                await listAllSitesAsync();
                break;
            case 2:
                // Run any Graph code
                await listWebPartsOnSitesAsync(settings, filePath);
                break;
            default:
                console.log('Invalid choice! Please try again.');
        }
    }
}

function initializeGraph(settings: AppSettings) {
    graphHelper.initializeGraphForAppOnlyAuth(settings);
}

async function displayAccessTokenAsync() {
    try {
        const userToken = await graphHelper.getAppOnlyTokenAsync();
        console.log(`App-only token: ${userToken}`);
    } catch (err) {
        console.log(`Error getting app-only access token: ${err}`);
    }
}

async function listAllSitesAsync() {
    try {
      let sites = await graphHelper.getAllSitesAsync();

      console.log(`Sites Found: ${sites.length}`);
  
    } catch (err) {
      console.log(`Error getting sites: ${err}`);
    }
  }

async function listSitesAsync() {
    try {
      const sitePage = await graphHelper.getSitesAsync();
      const sites: Site[] = sitePage.value;
  
      // Output each user's details
      for (const site of sites) {
        console.log(`Site: ${site.webUrl ?? 'NO NAME'}`);
        console.log(`  ID: ${site.id}`);
      }
  
      // If @odata.nextLink is not undefined, there are more users
      // available on the server
      const moreAvailable = sitePage['@odata.nextLink'] != undefined;
      console.log(`\nMore sites available? ${moreAvailable}`);
    } catch (err) {
      console.log(`Error getting sites: ${err}`);
    }
  }

async function listWebPartsOnSitesAsync(settings: AppSettings, filePath: string) {
    try {
        let sites = await graphHelper.getAllSitesAsync();

        console.log(`Sites Found: ${sites.length}`);

        await graphHelper.getWebpartsOnSites(sites, settings.webparts, filePath);

        
      } catch (err) {
        console.log(`Error getting sites: ${err}`);
      }
    }



main();

