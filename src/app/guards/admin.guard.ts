import { CanActivateFn } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const database = inject(DatabaseService)

  return false;
};
