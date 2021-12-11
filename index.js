const Discord = require("discord.js");
const ms = require("ms");
const token = "N/A"
const client = new Discord.Client({intents:["GUILDS", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGES"]})
const wait = require('util').promisify(setTimeout);
const noblox = require('noblox.js')
const cookie = "N/A"
const groupid = N/A
const request = require('request')

const baseEmbed = new Discord.MessageEmbed()
.setTimestamp()
.setColor("WHITE")
.setFooter("sq#8662")

const errBase = new Discord.MessageEmbed()
.setColor("RED")
.setTimestamp()
.setFooter("sq#8662")
.setTitle("Error")
.setDescription("Internal Error please contact sq#8662 with a screenshot of this message.")

const sucBase = new Discord.MessageEmbed()
.setColor("GREEN")
.setTimestamp()
.setFooter("sq#8662")
.setTitle("Success")

const helpEmbed = new Discord.MessageEmbed()
.setTimestamp()
.setFooter("sq#8662")

const promptEmbed = new Discord.MessageEmbed()
.setTimestamp()
.setFooter("sq#8662 | Say cancel to cancel this prompt | Prompt will end in 200 seconds")
.setColor("FUCHSIA")


client.on("ready", () => {
    console.log("I'm on!")

   // const guildId = "N/A"
  //  const guild = client.guilds.cache.get(guildId)


   //    let commands = guild.commands
//
//    commands.create({
  //      name: "promote",
  //      description: "Promote a user one rank",
  //      options: [
 //           {
  //              name: "username",
   //             description: "Roblox Username",
     //           required: true,
       //         type: Discord.Constants.ApplicationCommandOptionTypes.STRING
         //   }
//        ]
  //  })

  //  commands.create({
       // name: "demote",
     //   description: "Demotes a user one rank",
    //    options: [
     //       {
     //           name: "username",
     //           description: "Roblox Username",
      //          required: true,
    //           type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    //        }
      //  ]
  //  })

  //  commands.create({
    //    name: "setrank",
   //     description: "Sets a users rank",
    //    options: [
   //         {
    //            name: "username",
     //           description: "Roblox Username",
    //            required: true,
    //            type: Discord.Constants.ApplicationCommandOptionTypes.STRING 
    //       }, 
     //       {
      //          name: "rankid",
    //            description: "Rank ID",
     //           required: true,
     //           type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
     //       }
    //    ]
  //  })

 //   commands.create({
  //      name: "fire",
   //     description: "Sets a users rank to the lowest rank",
  //      options: [
     //       {
      //          name: "username",
     //           description: "Roblox username",
    //            required: true,
     //           type: Discord.Constants.ApplicationCommandOptionTypes.STRING
     //       }
  //      ]
//    })

 //   commands.create({
  //      name: "help",
 //       description: "Displays the help menu"
 //   })



})

client.on("interactionCreate", async (interaction) => {
    let logchannel = interaction.guild.channels.cache.get('896473339449725018')
    const lr = interaction.guild.roles.cache.find(role => role.name == 'Moderator');
    const mr = interaction.guild.roles.cache.find(role => role.name == 'Marine Headquarters');
    let rank = "USMC Personel"
        if(!lr || !mr) return interaction.editReply({embeds:[errBase]})
    if(!interaction.member) return interaction.editReply({embeds:[errBase]})
    if(interaction.member.roles.cache.some(role => role.id === lr.id)) rank = "MOD";
    if(interaction.member.roles.cache.some(role => role.id === mr.id)) rank = "HQ";
    if(interaction.member.permissions.has("ADMINISTRATOR")) rank = "ADMIN";
    if(interaction.member.user.id === "568199711669092362") rank = "ADMIN";

    if(!interaction.isCommand) return;

    const { commandName, options } = interaction

    if(commandName === "promote") {
        interaction.deferReply({ ephemeral: true })
        const username = options.getString('username')
        if(!rank === "ADMIN") return errBase.setDescription(`You lack the correct permissions to use this command! Rank: ${rank}`), interaction.editReply({embeds:[errBase]});
        if(!rank === "HQ") return errBase.setDescription(`You lack the correct permissions to use this command! Rank: ${rank}`), interaction.editReply({embeds:[errBase]});
        let DiscordId = interaction.user.id
              noblox.setCookie(cookie).then(async function() {
                let id = await noblox.getIdFromUsername(username)
                 .catch(err => {
                   errBase.setDescription("Uh oh! I couldn't find that username. Please use a valid roblox username.")
                   interaction.editReply({embeds:[errBase]});
                console.log(`[Promotion Error:] ${err}`)
             });
      
              if(!id) return interaction.editReply({embeds:[errBase]}), console.log(`[Promotion Error] Could not fetch ID.`)
      
              request({ url: `https://api.rowifi.link/v1/users/${DiscordId}` }, async function( 
                err,
                res,
                body
              ) {
                if (err) {
                  console.log("[RoWifi Error] "+err)
                  errBase.setDescription("You are not verified! Please verify with RoWifi before using this command.")
                  member.send({embeds:[errBase]})
                  return;
                } else {
                  var data = JSON.parse(body);
                  var rbxid = data.roblox_id;
                  let userankingroup = await noblox.getRankInGroup(groupid, rbxid)
                  .catch(err => {
                    interaction.editReply({embeds:[errBase]})
                    console.log(`[GET Rank Error:] ${err}`)
                  })
                  let victimrank = await noblox.getRankInGroup(groupid, id)
                  .catch(err => {
                    interaction.editReply({embeds:[errBase]});
                    console.log(`[Group Error:] ${err}`)
                  });
      
                  if(userankingroup <= victimrank) return errBase.setDescription("This user is a higher or the same rank than you are!") ,interaction.editReply({embeds:[errBase]})  
      
                  let rankingInfo;
                  try {
                      rankingInfo = await noblox.promote(groupid, id);
                  } catch (err) {
                      console.log(`[Promotion Error:] ${err}`);
                      interaction.editReply({embeds:[errBase]})
                      return
                  }
      
                  let username1
                  try {
                    username1 = await noblox.getUsernameFromId(id)
                  } catch (err) {
                    console.log(`[GET Username Error:] ${err}`);
                    interaction.editReply({embeds:[errBase]})
                    return
                  }
      
                  sucBase.setDescription(`Success! I have promoted **${username1}** to **${rankingInfo.newRole.name}**`)
                  interaction.editReply({embeds: [sucBase]})
                  baseEmbed.setTitle("Ranking Log")
                  baseEmbed.setDescription(`**${interaction.user}** promoted **${username1}** to **${rankingInfo.newRole.name}.**`)
                  logchannel.send({embeds: [baseEmbed]})
      
                }
              })
      
              })
    } if(commandName === "demote") {
        interaction.deferReply({ ephemeral: true })
        const username = options.getString('username')
        if(!rank === "ADMIN") return errBase.setDescription(`You lack the correct permissions to use this command! Rank: ${rank}`), interaction.editReply({embeds:[errBase]});
        if(!rank === "HQ") return errBase.setDescription(`You lack the correct permissions to use this command! Rank: ${rank}`), interaction.editReply({embeds:[errBase]});
        let DiscordId = interaction.user.id
              noblox.setCookie(cookie).then(async function() {
                let id = await noblox.getIdFromUsername(username)
                 .catch(err => {
                   errBase.setDescription("Uh oh! I couldn't find that username. Please use a valid roblox username.")
                   interaction.editReply({embeds:[errBase]});
                console.log(`[Demotion Error:] ${err}`)
             });
      
              if(!id) return interaction.editReply({embeds:[errBase]}), console.log(`[Demotion Error] Could not fetch ID.`)
      
              request({ url: `https://api.rowifi.link/v1/users/${DiscordId}` }, async function( 
                err,
                res,
                body
              ) {
                if (err) {
                  console.log("[RoWifi Error] "+err)
                  errBase.setDescription("You are not verified! Please verify with RoWifi before using this command.")
                  member.send({embeds:[errBase]})
                  return;
                } else {
                  var data = JSON.parse(body);
                  var rbxid = data.roblox_id;
                  let userankingroup = await noblox.getRankInGroup(groupid, rbxid)
                  .catch(err => {
                    interaction.editReply({embeds:[errBase]})
                    console.log(`[GET Rank Error:] ${err}`)
                  })
                  let victimrank = await noblox.getRankInGroup(groupid, id)
                  .catch(err => {
                    interaction.editReply({embeds:[errBase]});
                    console.log(`[Group Error:] ${err}`)
                  });
      
                  if(userankingroup <= victimrank) return errBase.setDescription("This user is a higher or the same rank than you are!") ,interaction.editReply({embeds:[errBase]})  
      
                  let rankingInfo;
                  try {
                      rankingInfo = await noblox.demote(groupid, id);
                  } catch (err) {
                      console.log(`[Demotion Error:] ${err}`);
                      interaction.editReply({embeds:[errBase]})
                      return
                  }
      
                  let username1
                  try {
                    username1 = await noblox.getUsernameFromId(id)
                  } catch (err) {
                    console.log(`[GET Username Error:] ${err}`);
                    interaction.editReply({embeds:[errBase]})
                    return
                  }
      
                  sucBase.setDescription(`Success! I have demoted **${username1}** to **${rankingInfo.newRole.name}**`)
                  interaction.editReply({embeds: [sucBase]})
                  baseEmbed.setTitle("Ranking Log")
                  baseEmbed.setDescription(`**${interaction.user}** demoted **${username1}** to **${rankingInfo.newRole.name}.**`)
                  logchannel.send({embeds: [baseEmbed]})
      
                }
              })
      
              })
    } else if(commandName === "setrank") {
        const username = options.getString('username')
        const rankid = options.getNumber('rankid')
        interaction.deferReply({ ephemeral: true })      
        if(!rank === "ADMIN") return errBase.setDescription(`You lack the correct permissions to use this command! Rank: ${rank}`), interaction.editReply({embeds:[errBase]});
        if(!rank === "HQ") return errBase.setDescription(`You lack the correct permissions to use this command! Rank: ${rank}`), interaction.editReply({embeds:[errBase]});
        let DiscordId = interaction.user.id
              noblox.setCookie(cookie).then(async function() {
                let id = await noblox.getIdFromUsername(username)
                 .catch(err => {
                   errBase.setDescription("Uh oh! I couldn't find that username. Please use a valid roblox username.")
                   interaction.editReply({embeds:[errBase]});
             });
      
              if(!id) return interaction.editReply({embeds:[errBase]}), console.log(`[Setrank Error] Could not fetch ID.`)
      
              request({ url: `https://api.rowifi.link/v1/users/${DiscordId}` }, async function( 
                err,
                res,
                body
              ) {
                if (err) {
                  console.log("[RoWifi Error] "+err)
                  errBase.setDescription("You are not verified! Please verify with RoWifi before using this command.")
                  member.send({embeds:[errBase]})
                  return;
                } else {
                  var data = JSON.parse(body);
                  var rbxid = data.roblox_id;
                  let userankingroup = await noblox.getRankInGroup(groupid, rbxid)
                  .catch(err => {
                    interaction.editReply({embeds:[errBase]})
                    console.log(`[GET Rank Error:] ${err}`)
                  })
                  let victimrank = await noblox.getRankInGroup(groupid, id)
                  .catch(err => {
                    interaction.editReply({embeds:[errBase]});
                    console.log(`[Group Error:] ${err}`)
                  });
      
                  if(userankingroup <= victimrank) return errBase.setDescription("This user is a higher or the same rank than you are!") ,interaction.editReply({embeds:[errBase]})  
                  if(victimrank === rankid) return errBase.setDescription("You cannot set a users rank to their current rank!") ,interaction.editReply({embeds:[errBase]})
                  let rankingInfo;
                  try {
                      rankingInfo = await noblox.setRank(groupid, id, rankid);
                  } catch (err) {
                      console.log(`[Setrank Error:] ${err}`);
                      interaction.editReply({embeds:[errBase]})
                      return
                  }
      
                  let username1
                  try {
                    username1 = await noblox.getUsernameFromId(id)
                  } catch (err) {
                    console.log(`[GET Username Error:] ${err}`);
                    interaction.editReply({embeds:[errBase]})
                    return
                  }
      
                  sucBase.setDescription(`Success! I have set **${username1}**'s rank to **${rankingInfo.name}.**`)
                  interaction.editReply({embeds: [sucBase]})
                  baseEmbed.setTitle("Ranking Log")
                  baseEmbed.setDescription(`**${interaction.user}** set **${username1}**'s rank to **${rankingInfo.name}.**`)
                  logchannel.send({embeds: [baseEmbed]})
      
                }
              })
      
              })
      } else if(commandName === "fire") {
        const username = options.getString('username')
        interaction.deferReply({ ephemeral: true })      
        if(!rank === "ADMIN") return errBase.setDescription(`You lack the correct permissions to use this command! Rank: ${rank}`), interaction.editReply({embeds:[errBase]});
        if(!rank === "HQ") return errBase.setDescription(`You lack the correct permissions to use this command! Rank: ${rank}`), interaction.editReply({embeds:[errBase]});
        let DiscordId = interaction.user.id
              noblox.setCookie(cookie).then(async function() {
                let id = await noblox.getIdFromUsername(username)
                 .catch(err => {
                   errBase.setDescription("Uh oh! I couldn't find that username. Please use a valid roblox username.")
                   interaction.editReply({embeds:[errBase]});
             });
      
              if(!id) return interaction.editReply({embeds:[errBase]}), console.log(`[Fire Error] Could not fetch ID.`)
      
              request({ url: `https://api.rowifi.link/v1/users/${DiscordId}` }, async function( 
                err,
                res,
                body
              ) {
                if (err) {
                  console.log("[RoWifi Error] "+err)
                  errBase.setDescription("You are not verified! Please verify with RoWifi before using this command.")
                  member.send({embeds:[errBase]})
                  return;
                } else {
                  var data = JSON.parse(body);
                  var rbxid = data.roblox_id;
                  let userankingroup = await noblox.getRankInGroup(groupid, rbxid)
                  .catch(err => {
                    interaction.editReply({embeds:[errBase]})
                    console.log(`[GET Rank Error:] ${err}`)
                  })
                  let victimrank = await noblox.getRankInGroup(groupid, id)
                  .catch(err => {
                    interaction.editReply({embeds:[errBase]});
                    console.log(`[Group Error:] ${err}`)
                  });
      
                  if(userankingroup <= victimrank) return errBase.setDescription("This user is a higher or the same rank than you are!") ,interaction.editReply({embeds:[errBase]})  
                  if(victimrank === 1) return errBase.setDescription("This user is already the lowest rank!") ,interaction.editReply({embeds:[errBase]})
                  let rankingInfo;
                  try {
                      rankingInfo = await noblox.setRank(groupid, id, 1);
                  } catch (err) {
                      console.log(`[Fire Error:] ${err}`);
                      interaction.editReply({embeds:[errBase]})
                      return
                  }
      
                  let username1
                  try {
                    username1 = await noblox.getUsernameFromId(id)
                  } catch (err) {
                    console.log(`[GET Username Error:] ${err}`);
                    interaction.editReply({embeds:[errBase]})
                    return
                  }
      
                  sucBase.setDescription(`Success! I have fired **${username1}**`)
                  interaction.editReply({embeds: [sucBase]})
                  baseEmbed.setTitle("Ranking Log")
                  baseEmbed.setDescription(`**${interaction.user}** fired **${username1}**`)
                  logchannel.send({embeds: [baseEmbed]})
      
                }
              })
      
              })
      } else if(commandName === "help") {
        helpEmbed.setColor("WHITE")
        helpEmbed.setTitle("Help")
        helpEmbed.setDescription(`Welcome to the help menu! All of my commands are listed below! \n\n **Prefix: /**`)
        helpEmbed.addField(`Moderation`, `N/A`)
        helpEmbed.addField("Ranking", `\`\`\`/promote - Promotes the specified user one rank\n/demote - Demotes the specified user one rank\n/setrank - Set's the user's rank to the one specified\n/fire - Set's the users rank to Premium Customer.\`\`\``)
        helpEmbed.addField(`Misc`, `N/A`)
        helpEmbed.addField(`Developer`, `N/A`)
        interaction.reply({ embeds:[helpEmbed], ephemeral: true });
      }


})

client.login(token)
