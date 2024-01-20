import { SetMetadata } from '@nestjs/common';

export const Roles = (...args: string[]) => {
  console.log(`Setting roles metadata:`, args);
  return SetMetadata('roles', args);
};
