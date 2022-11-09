import { Command } from '@oclif/core';
import chalk from 'chalk';

import { ApiError } from './api';

export abstract class CliCommand extends Command {
  async catch(error: any) {
    const { status, body } = error;

    if (error instanceof ApiError) {
      switch (status) {
        case 401:
          return this.error(
            `Authentication failure. Please obtain a new deployment key at https://app.subsquid.io and follow the instructions`,
          );
        case 400:
          if (body.invalidFields) {
            const messages = body.invalidFields.map(function (obj: any, index: number) {
              return `${index + 1}) ${chalk.bold('"' + obj.path.join('.') + '"')} — ${obj.message}`;
            });
            return this.error(`Validation error:\n${messages.join('\n')}`);
          }
          return this.error(body.message);
        case 404:
          return this.error(body?.message || 'API url not found');

        case 405:
          return this.error(body?.message || 'Method not allowed');
        default:
          return this.error(
            'Squid server error. Please come back later. If the error persists please open an issue at https://github.com/subsquid/squid and report to t.me/HydraDevs',
          );
      }
    }

    throw error;
  }
}
