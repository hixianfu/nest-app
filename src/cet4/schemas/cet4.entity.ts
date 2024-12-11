import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity('wine_cet4_word')
export class Cet4 {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'ID', example: 1 })
    id: number

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty({ description: '单词', example: 'abandon' })   
    cet4_word: string

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty({ description: '音标', example: '[æbændən]' })
    cet4_phonetic: string

    @Column({ type: 'text' })
    @ApiProperty({ description: '单词翻译', example: 'v. 放弃，抛弃' })
    cet4_translate: string

    @Column({ type: 'text' })
    @ApiProperty({ description: '单词变形', example: 'abandoned, abnegation' })
    cet4_distortion: string

    @Column({ type: 'text' })
    @ApiProperty({ description: '单词短语', example: 'abandon one\'s plans' })
    cet4_phrase: string

    @Column({ type: 'text' })
    @ApiProperty({ description: '单词例句', example: 'I have abandoned my plans.' })
    cet4_samples: string
}
