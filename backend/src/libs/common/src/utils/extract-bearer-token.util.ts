import { UnauthorizedException } from '@nestjs/common';

export function extractBearerToken(token?: string): string | undefined {
  if (!token) throw new UnauthorizedException('No tokens');
  const [type, value] = token.split(' ');
  if (type !== 'Bearer' && !value) {
    throw new UnauthorizedException('No tokens');
  }
  return value;
}
