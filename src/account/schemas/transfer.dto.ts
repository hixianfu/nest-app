import { ApiProperty } from "@nestjs/swagger";


export class TransferDto {
    @ApiProperty({ description: '转出用户ID' })
    fromUserId: number;

    @ApiProperty({ description: '转入用户ID' })
    toUserId: number;

    @ApiProperty({ description: '转账金额' })
    amount: number; 
}
