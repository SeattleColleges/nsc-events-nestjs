// This guard controls access to routes based on whether the route is public or requires authentication

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Built-in NestJS wrapper for Passport strategies (e.g., JWT)
import { Reflector } from '@nestjs/core'; // Used to access metadata like @Public()
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator'; // Custom metadata key set by @Public()

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Inject Reflector to read route metadata (e.g., check if the route has @Public())
  constructor(private reflector: Reflector) {
    super(); // Call the parent constructor (AuthGuard sets up JWT strategy)
  }

  // This method runs for every request hitting a route
  canActivate(context: ExecutionContext) {
    // Check if the route or controller has the @Public() decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // checks method-level decorator (e.g., a single route)
      context.getClass(), // checks controller-level decorator (e.g., whole controller)
    ]);

    // If @Public() is present, skip authentication and allow the request
    if (isPublic) {
      return true;
    }

    // Otherwise, apply default JWT authentication
    return super.canActivate(context);
  }
}
