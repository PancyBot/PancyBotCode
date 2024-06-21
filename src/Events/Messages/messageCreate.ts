import { Event } from "../../Structure/Events";
import { client, logs, utils } from '../..';
import { botStaff } from '../../Database/Local/variables.json';
const mayus = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default new Event('messageCreate', async msg => {
    if(msg.webhookId) return
    const {guild } = msg

    if(!guild) return logs.log('No is guild');
    if(!guild.available) return logs.log('Guild unavilable');
    
    var prefix = 'pan!'

    logs.log(prefix)
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const prefixRegex = new RegExp(
        `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
      );
    
    if (!prefixRegex.test(msg.content)) return;
    if(msg.author.bot) return msg.reply({ content: 'Los bots no tienen permitidos los comandos' })

    
    const [, matchedPrefix] = msg.content.match(prefixRegex);

    const args = msg.content
      .slice(matchedPrefix.length)
      .trim()
      .split(/ +/g);

    const cmd = args.shift().toLowerCase();
    if (cmd.length == 0) return;
    const command = client.commandsMsg.get(cmd)
    if(command) {
      let userPermissions = command.userPermissions;
      let botPermissions = command.botPermissions;
      if(!msg.member.permissions.has(userPermissions || [])) return msg.reply(`No tienes permisos para ejecutar este comando.\n Uno de estos permisos puede faltar: \`${typeof userPermissions === 'string' ? userPermissions : userPermissions.join(', ')}\``)
      if(!msg.guild.members.cache.get(client.user.id).permissions.has(botPermissions || [])) return msg.reply(`No tengo permisos para ejecutar este comando.\n Uno de estos permisos puede faltar: \`${typeof botPermissions === 'string' ? botPermissions : botPermissions.join(', ')}\``)
      if(command.isDev) {
        if(msg.author.id !== botStaff.ownerBot) return msg.reply('Comando solo de desarrollador')
        command.run({
          args,
          client,
          message: msg,
        })
      } else  if (command.database) {
        const DBStatus = utils.getStatusDB().isOnline
        if(!DBStatus) return msg.reply({ content: "Comando no disponible temporalmente \n\nMotivo: `DATABASE ERROR`" })
      } else if(command.inVoiceChannel) {
        if(!msg.member.voice.channel) return msg.reply('Necesitas unirte a un canal de vox')
        command.run({
            args,
            client,
            message: msg,
        })
      } else {
        command.run({
          args,
          client,
          message: msg,
        })
      }
    } else {
      logs.log('No existe el comando:' + cmd)
    }
  }
)