import { User } from "src/users/schemas/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('account')
export class AccountEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // 外键userId
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'double', comment: '余额' })
    balance: number;
}
