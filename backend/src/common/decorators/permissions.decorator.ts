import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// Module access decorator
export const MODULE_KEY = 'module';
export const RequireModule = (moduleCode: string) =>
  SetMetadata(MODULE_KEY, moduleCode);
