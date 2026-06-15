import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEntity, LessonEntity } from '../../database/entities';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(LessonEntity)
    private readonly lessonRepo: Repository<LessonEntity>,
  ) {}

  // === PUBLIC ===

  async getPublishedCourses() {
    return this.courseRepo.find({
      where: { isPublished: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
      relations: ['lessons'],
    });
  }

  async getCourseById(id: string) {
    const course = await this.courseRepo.findOne({ where: { id }, relations: ['lessons'] });
    if (!course) throw new NotFoundException('Course not found');
    if (course.lessons) course.lessons.sort((a, b) => a.sortOrder - b.sortOrder);
    return course;
  }

  // === ADMIN ===

  async getAllCourses() {
    return this.courseRepo.find({ order: { sortOrder: 'ASC', createdAt: 'DESC' }, relations: ['lessons'] });
  }

  async createCourse(dto: { title: string; description?: string; icon?: string; usdPrice: number; thumbnailUrl?: string; isPublished?: boolean; sortOrder?: number }) {
    const course = this.courseRepo.create(dto);
    return this.courseRepo.save(course);
  }

  async updateCourse(id: string, dto: Partial<{ title: string; description: string; icon: string; usdPrice: number; thumbnailUrl: string; isPublished: boolean; sortOrder: number }>) {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    Object.assign(course, dto);
    return this.courseRepo.save(course);
  }

  async deleteCourse(id: string) {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    await this.courseRepo.remove(course);
    return { deleted: true };
  }

  // === LESSONS ===

  async addLesson(courseId: string, dto: { title: string; videoUrl?: string; duration?: string; sortOrder?: number }) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    const lesson = this.lessonRepo.create({ ...dto, courseId });
    return this.lessonRepo.save(lesson);
  }

  async updateLesson(id: string, dto: Partial<{ title: string; videoUrl: string; duration: string; sortOrder: number }>) {
    const lesson = await this.lessonRepo.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    Object.assign(lesson, dto);
    return this.lessonRepo.save(lesson);
  }

  async deleteLesson(id: string) {
    const lesson = await this.lessonRepo.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    await this.lessonRepo.remove(lesson);
    return { deleted: true };
  }
}
