import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { Project } from './entities/project.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAllPublished(query: ProjectQueryDto) {
    const { categoryId, page = 1, limit = 10, search } = query;

    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.category', 'category')
      .where('project.isPublished = :isPublished', { isPublished: true });

    if (categoryId) {
      queryBuilder.andWhere('project.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(project.title ILIKE :search OR project.description ILIKE :search OR project.shortDescription ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy('project.sortOrder', 'ASC')
      .addOrderBy('project.publishedAt', 'DESC');

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(query: ProjectQueryDto) {
    const { categoryId, page = 1, limit = 10, search } = query;

    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.category', 'category');

    if (categoryId) {
      queryBuilder.where('project.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      const searchCondition = categoryId ? 'andWhere' : 'where';
      queryBuilder[searchCondition](
        '(project.title ILIKE :search OR project.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy('project.sortOrder', 'ASC')
      .addOrderBy('project.createdAt', 'DESC');

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { slug, isPublished: true },
      relations: ['category'],
    });

    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }

    return project;
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // Check if category exists
    await this.categoriesService.findById(createProjectDto.categoryId);

    // Check slug uniqueness
    const existingProject = await this.projectRepository.findOne({
      where: { slug: createProjectDto.slug },
    });

    if (existingProject) {
      throw new ConflictException(
        `Project with slug "${createProjectDto.slug}" already exists`,
      );
    }

    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findById(id);

    // Check category if changed
    if (updateProjectDto.categoryId) {
      await this.categoriesService.findById(updateProjectDto.categoryId);
    }

    // Check slug uniqueness if changed
    if (updateProjectDto.slug && updateProjectDto.slug !== project.slug) {
      const existingProject = await this.projectRepository.findOne({
        where: { slug: updateProjectDto.slug },
      });

      if (existingProject) {
        throw new ConflictException(
          `Project with slug "${updateProjectDto.slug}" already exists`,
        );
      }
    }

    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findById(id);
    await this.projectRepository.remove(project);
  }

  async publish(id: string): Promise<Project> {
    const project = await this.findById(id);

    if (project.isPublished) {
      throw new BadRequestException('Project is already published');
    }

    project.isPublished = true;
    project.publishedAt = new Date();

    return this.projectRepository.save(project);
  }

  async unpublish(id: string): Promise<Project> {
    const project = await this.findById(id);

    if (!project.isPublished) {
      throw new BadRequestException('Project is not published');
    }

    project.isPublished = false;
    project.publishedAt = null as any;

    return this.projectRepository.save(project);
  }
}
