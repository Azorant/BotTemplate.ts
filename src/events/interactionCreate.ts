import { Events, type Interaction } from 'discord.js';
import { Event } from '../types/event.ts';
import { Main } from '../index.ts';

export default class InteractionCreate implements Event<Events.InteractionCreate> {
  event = Events.InteractionCreate;
  async execute(context: Main, interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = context.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(context, interaction);
      context.info('Command', interaction.inGuild() ? interaction.guildId : 'DM', interaction.user.id, interaction.user.username, `/${interaction.commandName} ${interaction.options.data.map((o) => `${o.name}:${o.value}`)}`);
    } catch (error) {
      context.error('Command', 'Error while executing command', error);
      const embed = {
        title: 'Oh no!',
        description: `An error has occurred, please try again.\nIf it keeps happening join the [support server](https://discord.gg/${Deno.env.get('DISCORD_INVITE')})`,
      };

      if (interaction.replied) {
        interaction.editReply({
          content: '',
          embeds: [embed],
        });
      } else {
        interaction.reply({ embeds: [embed] });
      }
    }
  }
}
