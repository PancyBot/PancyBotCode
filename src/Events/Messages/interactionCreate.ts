import { CommandInteractionOptionResolver, GuildMember } from "discord.js";
import { client, utils } from '../..';
import { Event } from "../../Structure/Events";
import { ExtendedInteraction } from "../../Types/CommandSlash";
import { botStaff } from '../../Database/Local/variables.json'
import { _guild } from "./messageCreate";

export default new Event("interactionCreate", async (interaction) => {
    console.log(interaction.id)
    if (interaction.isCommand()) {
        console.log(interaction.isRepliable())
        await interaction.deferReply();
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return interaction.followUp("You have used a non existent command");
            let userPermissions = command.userPermissions;
            let botPermissions = command.botPermissions;
            if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has(userPermissions || [])) return interaction.followUp(`No tienes permisos para ejecutar este comando.\n Uno de estos permisos puede faltar: \`${typeof userPermissions === 'string' ? userPermissions : userPermissions.join(', ')}\``)
            if(!interaction.guild.members.cache.get(client.user.id).permissions.has(botPermissions || [])) return interaction.followUp(`No tengo permisos para ejecutar este comando.\n Uno de estos permisos puede faltar: \`${typeof botPermissions === 'string' ? botPermissions : botPermissions.join(', ')}\``)
        if(command.isDev) {
            if(interaction.user.id !== botStaff.ownerBot) return interaction.followUp("Solo el dueño del bot puede usar este commando"); console.log('NO')
            command.run({
                args: interaction.options as CommandInteractionOptionResolver,
                client,
                interaction: interaction as ExtendedInteraction,
                _guild
            });
        } else if (command.database) {
            const DBStatus = utils.getStatusDB().isOnline
            if(!DBStatus) return interaction.followUp({ content: "Comando no disponible temporalmente \n\nMotivo: `DATABASE ERROR`", ephemeral: true })
        } else if (command.inVoiceChannel) {
            if(!(interaction.member as GuildMember).voice.channel) return interaction.followUp("Necesitas estas conectado a un canal de texto")
            command.run({
                args: interaction.options as CommandInteractionOptionResolver,
                client,
                interaction: interaction as ExtendedInteraction,
                _guild
            });
        } else {
            command.run({
                args: interaction.options as CommandInteractionOptionResolver,
                client,
                interaction: interaction as ExtendedInteraction,
                _guild
            });
        }
    }
});
