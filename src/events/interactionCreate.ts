import { type CommandInteractionOption, Events, type Interaction } from 'discord.js';
import { Event } from '../types/event.ts';
import { Main } from '../index.ts';

export default class InteractionCreate implements Event<Events.InteractionCreate> {
  event = Events.InteractionCreate;

  parseArgs(args: readonly CommandInteractionOption[]) {
    const parsed: string[] = [];
    for (const arg of args) {
      if (arg.options) {
        parsed.push(arg.name, ...this.parseArgs(arg.options));
      } else {
        parsed.push(`${arg.name}:${arg.value}`);
      }
    }

    return parsed;
  }

  async execute(context: Main, interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      const command = context.commands.get(interaction.commandName);
      if (!command) return;

      try {
        console.log(
          'Command',
          interaction.inGuild() ? interaction.guildId : 'DM',
          interaction.user.id,
          interaction.user.username,
          `/${interaction.commandName}`,
          ...this.parseArgs(interaction.options.data),
        );
        await command.execute(context, interaction);
      } catch (error) {
        console.error('Command', 'Error while executing command', error);
        const embed = {
          title: 'Oh no!',
          description: `An error has occurred, please try again.\nIf it keeps happening join the [support server](https://discord.gg/${
            Deno.env.get('DISCORD_INVITE')
          })`,
        };

        if (interaction.replied || interaction.deferred) {
          interaction.editReply({
            content: '',
            embeds: [embed],
          });
        } else {
          interaction.reply({ embeds: [embed] });
        }
      }
    } else if (interaction.isAutocomplete()) {
      const command = context.commands.get(interaction.commandName);
      if (!command?.handleAutocomplete) return;

      try {
        await command.handleAutocomplete(context, interaction);
      } catch (error) {
        console.error('Command', 'Error while executing autocomplete', error);
      }
    }
  }
}
