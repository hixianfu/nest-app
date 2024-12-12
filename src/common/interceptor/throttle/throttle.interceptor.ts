import { Injectable, ExecutionContext, CallHandler, NestInterceptor } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerException } from "@nestjs/throttler";
import { Observable } from "rxjs";

@Injectable()
export class ThrottleInterceptor extends ThrottlerGuard implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const canActivate = await this.canActivate(context);
        
        if (!canActivate) {
            throw new ThrottlerException('请求过于频繁，请稍后再试');   
        }
        
        return next.handle();
    }
}