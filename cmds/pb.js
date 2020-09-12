const Discord = require('discord.js')

module.exports.run = async (bot, message, args, db, guild) => {
  console.log(`Running command ${this.cmd.name}`);
  let discordID = message.author.id;

  let doc = await db
    .collection("users")
    .where("discordId", "==", discordID)
    .get();
  doc = doc.docs;
  if (doc.length === 0) {
    return {
      status: false,
      message: `Could not find user`,
    };
  }

  doc = doc[0].data();

  let pbObj = doc.personalBests;

  const maxesTime = Object.fromEntries(
    Object.entries(pbObj.time).map(([key, array]) => [
      key,
      Math.max(...array.map(({ wpm }) => wpm)),
    ])
  );

  const maxesWords = Object.fromEntries(
    Object.entries(pbObj.words).map(([key, array]) => [
      key,
      Math.max(...array.map(({ wpm }) => wpm)),
    ])
  );

  //embeds that display records

message.channel.send(`**__Timed Personal Bests for ${message.author.username}__**`);

  const scoreTimeEmbed = new Discord.MessageEmbed()
    .setColor("#e2b714")
    .setThumbnail('https://www.emoji.co.uk/files/microsoft-emojis/objects-windows10/9747-alarm-clock.png')
    .setTimestamp()
    .setFooter('https://monkey-type.com/')
  verifyTimeDefined(15)
  verifyTimeDefined(30)
  verifyTimeDefined(60)
  verifyTimeDefined(120)
  message.channel.send(scoreTimeEmbed);

message.channel.send(`**__Word Personal Bests for ${message.author.username}__**`);

  const scoreWordsEmbed = new Discord.MessageEmbed()
    .setColor("#e2b714")
    .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/81/desktop-computer_1f5a5.png')
    .setTimestamp()
    .setFooter('https://monkey-type.com/')
  verifyWordDefined(10)
  verifyWordDefined(25)
  verifyWordDefined(50)
  verifyWordDefined(100)
  message.channel.send(scoreWordsEmbed);

  //functions for adding fields and finding values (some of which are a nightmare)

  function findWordRaw(val) { 
    let timeVal = val
    let rawToFind = maxesWords[val]
    let {raw} = pbObj.words[timeVal].find(({wpm})=>wpm===rawToFind);
    return raw
  };

  function findTimeRaw(val) { 
    let timeVal = val
    let rawToFind = maxesTime[val]
    let {raw} = pbObj.time[timeVal].find(({wpm})=>wpm===rawToFind);
    return raw
  };

  function findWordAcc(val) { 
    let timeVal = val
    let accToFind = maxesWords[val]
    let {acc} = pbObj.words[timeVal].find(({wpm})=>wpm===accToFind);
    return acc
  };

  function findTimeAcc(val) { 
    let timeVal = val
    let accToFind = maxesTime[val]
    let {acc} = pbObj.time[timeVal].find(({wpm})=>wpm===accToFind);
    return acc
  };

  function verifyTimeDefined(element) {
    if (maxesTime[element]) {
      scoreTimeEmbed.addField(`${element}s Highscore:`, `${maxesTime[element]} wpm`, true);
      scoreTimeEmbed.addField(`Raw:`, `${findTimeRaw(element) === undefined ?'-':findTimeRaw(element)} wpm`, true);
      scoreTimeEmbed.addField(`Accuracy:`, `${findTimeAcc(element)}%`, true);
      scoreTimeEmbed.addField(`\u200b`, `\u200b`);
    };
  };

  function verifyWordDefined(element) {
    if (maxesWords[element]) {
      scoreWordsEmbed.addField(`${element}s Highscore:`, `${maxesWords[element]} wpm`, true);
      scoreWordsEmbed.addField(`Raw:`, `${findWordRaw(element) === undefined ?'-':findWordRaw(element)} wpm`, true);
      scoreWordsEmbed.addField(`Accuracy:`, `${findWordAcc(element)}%`, true);
      scoreWordsEmbed.addField(`\u200b`, `\u200b`);
    };
  };
};
  
  module.exports.cmd = {
    name: "pb",
    needMod: false,
  };
