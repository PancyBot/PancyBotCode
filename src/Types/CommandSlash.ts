import {
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    PermissionResolvable
} from 'discord.js';
import { ExtendedClient } from '../Structure/Client';
import { GuildDataFirst } from '../Database/Type/Security';

/**
 * {
 *  name: 'commandname',
 * description: 'any description',
 * run: async({ interaction }) => {
 *
 * }
 * }
 */
export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
}

interface RunOptions {
    client: ExtendedClient;
    interaction: ExtendedInteraction;
    args: CommandInteractionOptionResolver;
    _guild: GuildDataFirst;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
    userPermissions?: PermissionResolvable[];
    botPermissions?: PermissionResolvable[];
    isDev?: boolean;
    inVoiceChannel?: boolean;
    run: RunFunction;
    database?: boolean;
} & ChatInputApplicationCommandData;