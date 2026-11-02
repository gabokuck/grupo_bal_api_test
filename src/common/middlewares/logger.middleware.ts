import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = performance.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const durationMs = (performance.now() - start).toFixed(2);
      const { statusCode } = res;
      console.log(
        `[Logger] ${method} ${originalUrl} - ${statusCode} - ${durationMs}ms`,
      );
    });

    next();
  }
}
