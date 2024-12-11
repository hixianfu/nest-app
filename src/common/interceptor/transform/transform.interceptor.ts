import { CallHandler, ExecutionContext, NestInterceptor, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ResultData } from '../../utils/ResultData'
 
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return ResultData.ok(data)
      }),
    )
  }
}