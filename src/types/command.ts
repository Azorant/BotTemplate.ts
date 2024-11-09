import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import type { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { Main } from '../index.ts';

export abstract class Command {
  abstract definition: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
  abstract execute(context: Main, interaction: ChatInputCommandInteraction): Promise<void> | void;
}

export interface Command {
  handleAutocomplete?(context: Main, interaction: AutocompleteInteraction): Promise<void> | void;
}
