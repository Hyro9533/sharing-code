//Launcher Client
const {Client, Collection, Intents } = require("discord.js");

const { loadSlashCommands } = require(".../loadSlashCommands");

const client = new Client(
  {
    intents : [
      "GUILDS",
      "GUILD_MEMBERS",
      "GUILD_BANS",
      "GUILD_EMOJIS_AND_STICKERS",
      "GUILD_INTEGRATIONS",
      "GUILD_WEBHOOKS",
      "GUILD_INVITES",
      "GUILD_VOICE_STATES",
      "GUILD_PRESENCES",
      "GUILD_MESSAGES",
      "GUILD_MESSAGE_REACTIONS",
      "GUILD_MESSAGE_TYPING",
      "DIRECT_MESSAGES",
      "DIRECT_MESSAGE_REACTIONS",
      "DIRECT_MESSAGE_TYPING",
      "GUILD_SCHEDULED_EVENTS",
    ], 
  },
  {
    partials: [
      'USER',
      'GUILD_MEMBER',
      'MESSAGE',
      'CHANNEL',
      'REACTION',
      'GUILD_SCHEDULED_EVENT'
    ],
  },
  {
    disableEveryone : false,
  }
);

[
  "slashCommands",
].forEach(collection => client[collection] = new Collection ());

loadSlashCommands(client);

client.login(...);







//Loader Slash
const { readdirSync } = require("fs");
var _ = require('lodash');  

const loadSlashCommands = (client, dir = "./interactions/slashCommands/") => {
  readdirSync(dir).forEach((dirs) => {
    const commands = readdirSync(`${dir}${dirs}/`).filter((files) => files.endsWith(".js"));
    
    for (const file of commands) {
      const getFileName = require(`../../../${dir}${dirs}/${file}`);
     
      client.slashCommands.set(getFileName.help.name, getFileName);
      
      console.log(`Slash chargée: ${getFileName.help.name}`);

      
    } 
    console.log("--------------")
  });
};

async function getClientSlashCommands(client) {
  let commandsClientMap = []

  await client.slashCommands.map(async commands => {

    await commandsClientMap.push(commands.help)
  })

  await new Promise(resolve => setTimeout(resolve, 2000)); 
   
  return  commandsClientMap;
};

async function setPermissionsForSlashCommands(client,commandsData) {
  let compteur = 1;  
  let error = false;

  for(const command of commandsData) {
    
    const dataOfCommandLocal = await client.slashCommands.get(command[1].name)



    const permissionsOfCommands = await command[1].permissions.fetch().catch(err => error = true)

    
    if(permissionsOfCommands && error !== true) { 

      if(_.isEqual(permissionsOfCommands, dataOfCommandLocal.help.permissions) === false) {

        await command[1].permissions.set({ permissions: dataOfCommandLocal.help.permissions });
      }; 

    } else {

      await command[1].permissions.set({ permissions: dataOfCommandLocal.help.permissions });

    };

    console.log(`${compteur}/${client.slashCommands.size}`)

    compteur ++;
    error = false
  };

  return;
};

async function postSlashCommands(client, guild) {

  const commandsLocalClient = await getClientSlashCommands(client)

  await guild.commands.set(commandsLocalClient);
  
  await setPermissionsForSlashCommands(client,await guild.commands.fetch())

  return;
};


module.exports = {
  loadSlashCommands,
  postSlashCommands,
};



//READY.JS

const { postSlashCommands } = require(".../loadSlashCommands");

module.exports = async (client) => {

  const guild = await ...;
 
  await postSlashCommands(client,guild);


  console.log("\n\Client Ready\n")
  return;
 };


//Exemple d'une data de Slash

CLEAR: {
  name : "m-clear",
  description : "(MODO) Supprime un nombre de message.",
  category : "Moderateur",
  SetOnlyForCodeur : true,
  SetOnlyForAdmin : true,
  SetOnlyForModerator : true,
  SetOnlyForStaff : false,        
  InDebugLOCKED : false,
  defaultPermission : false,
  options : [{
    name : "valeur",
    type : 4,
    description : "Choisie une valeur !",
    required : true,
    choices: [
      {
        name: 1,
        value: 1,
      },
      {
        name: 5,
        value: 5,
      },
      {
        name: 10,
        value: 10,
      },
      {
        name: 25,
        value: 25,
      },
      {
        name: 50,
        value: 50,
      },
      {
        name: 75,
        value: 75,
      },
      {
        name: 100,
        value: 100,
      },
    ],
  }], 
  permissions : [{
    id : '226759864679006208',
    permission : true,
    type : 'USER',
  },
  {
    id : '824450805788442715',
    permission : true,
    type : 'ROLE'
  }],
},