import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  book_id!: number;

  @Column({ type: 'varchar', length: 255 })
  book_title!: string;

  @Column({ type: 'varchar', length: 255 })
  author!: string;

  @Column({ name: 'published_year', type: 'integer', nullable: true }) 
  publishedYear!: number;
}