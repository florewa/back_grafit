import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'short_description', nullable: true })
  shortDescription: string;

  @Column({ nullable: true })
  client: string;

  @Column({ nullable: true, type: 'int' })
  year: number;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  area: string;

  @Column({ name: 'cover_image', nullable: true })
  coverImage: string;

  @Column({ type: 'jsonb', nullable: true })
  images: string[];

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ name: 'published_at', nullable: true, type: 'timestamp' })
  publishedAt: Date;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
