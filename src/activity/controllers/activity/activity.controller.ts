import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  BadRequestException,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ActivityService } from '../../services/activity/activity.service';
import { Activity } from '../../schemas/activity.schema';
import { CreateActivityDto } from '../../dto/create-activity.dto';
import { UpdateActivityDto } from '../../dto/update-activity.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../../auth/schemas/userAuth.model';
import { AttendEventDto } from '../../dto/attend-event.dto';
@Controller('events')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Get('')
  async getAllActivities(@Query() query: ExpressQuery): Promise<Activity[]> {
    return await this.activityService.getAllActivities(query);
  }
  @Get('find/:id')
  async findActivityById(@Param('id') id: string): Promise<Activity> {
    return this.activityService.getActivityById(id);
  }
  // request all events created by a specific user
  @Get('user/:userId')
  async getActivitiesByUserId(
    @Param('userId') userId: string,
    @Query() query: ExpressQuery,
  ): Promise<Activity[]> {
    return this.activityService.getActivitiesByUserId(query, userId);
  }

  @Post('attend/:id')
  @UseGuards(AuthGuard())
  // TODO: rate limit this so you can't spam this route
  async attendEvent(
    @Param('id') eventId: string,
    @Body() attendEventDto: AttendEventDto,
  ) {
    return await this.activityService.attendEvent(eventId, attendEventDto);
  }

  @Post('new')
  @UseGuards(AuthGuard())
  async addEvent(
    @Body() activity: CreateActivityDto,
    @Req() req: any,
  ): Promise<{ activity: Activity; message: string }> {
    console.log(req.user);
    if (req.user.role != Role.user) {
      return await this.activityService.createEvent(activity, req.user);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Put('update/:id')
  @UseGuards(AuthGuard())
  async updateActivityById(
    @Param('id') id: string,
    @Body() activity: UpdateActivityDto,
    @Req() req: any,
  ): Promise<{ updatedActivity: Activity; message: string }> {
    // return activity to retrieve createdByUser property value
    const preOperationActivity = await this.activityService.getActivityById(id);
    // admin can make edits regardless
    if (req.user.role === Role.admin) {
      return await this.activityService.updateActivityById(id, activity);
    }
    // have to check if they are the creator and if they still have creator access
    if (
      preOperationActivity.createdByUser.equals(req.user._id) &&
      req.user.role === Role.creator
    ) {
      return await this.activityService.updateActivityById(id, activity);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('remove/:id')
  @UseGuards(AuthGuard())
  async deleteActivityById(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<{ deletedActivity: Activity; message: string }> {
    const preOperationActivity = await this.activityService.getActivityById(id);
    if (req.user.role === Role.admin) {
      return this.activityService.deleteActivityById(id);
    }
    if (
      preOperationActivity.createdByUser.equals(req.user._id) &&
      req.user.role === Role.creator
    ) {
      return await this.activityService.deleteActivityById(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Put('archive/:id')
  @UseGuards(AuthGuard())
  async archiveActivityById(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<{ archivedActivity: Activity; message: string }> {
    const preOperationActivity: Activity =
      await this.activityService.getActivityById(id);
    if (req.user.role === Role.admin) {
      return this.activityService.archiveActivityById(id);
    }
    if (
      preOperationActivity.createdByUser.equals(req.user._id) &&
      req.user.role === Role.creator
    ) {
      return await this.activityService.archiveActivityById(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  /**
   * Upload a cover image for an event
   *
   * @param id - The event ID
   * @param file - The image file to upload
   * @returns The updated event with cover image URL
   */
  @Put(':id/cover-image')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('coverImage'))
  async uploadCoverImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<{ updatedActivity: Activity; message: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const activity = await this.activityService.getActivityById(id);

    const isAdmin = req.user.role === Role.admin;
    const isCreator =
      req.user.role === Role.creator &&
      activity.createdByUser.equals(req.user._id);

    if (!isAdmin && !isCreator) {
      throw new UnauthorizedException(
        'You are not authorized to upload a cover image for this event',
      );
    }

    const updatedActivity = await this.activityService.addCoverImage(id, file);
    return { updatedActivity, message: 'Cover image uploaded successfully' };
  }

  /**
  * Delete a cover image for an event
  * 
  * @param id - The event ID
  & @returns The updated event with cover image URL
  */
  @Delete(':id/cover-image')
  @UseGuards(AuthGuard())
  async deleteCoverImage(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<{ updatedActivity: Activity; message: string }> {
    const activity = await this.activityService.getActivityById(id);

    const isAdmin = req.user.role === Role.admin;
    const isCreator =
      req.user.role === Role.creator &&
      activity.createdByUser.equals(req.user._id);

    if (!isAdmin && !isCreator) {
      throw new UnauthorizedException(
        'You are not authorized to delete a cover image for this event',
      );
    }

    const updatedActivity = await this.activityService.deleteCoverImage(id);
    return { updatedActivity, message: 'Cover image deleted successfully' };
  }

  /**
   * Upload a document for an event
   *
   * @param id - The event ID
   * @param file - The document file to upload
   * @returns The updated event with document URL
   */
  @Put(':id/document')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocument(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ updatedActivity: Activity; message: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const activity = await this.activityService.getActivityById(id);

    const isAdmin = req.user.role === Role.admin;
    const isCreator =
      req.user.role === Role.creator &&
      activity.createdByUser.equals(req.user._id);

    if (!isAdmin && !isCreator) {
      throw new UnauthorizedException(
        'You are not authorized to delete a cover image for this event',
      );
    }
    const updatedActivity = await this.activityService.addDocument(id, file);
    return { updatedActivity, message: 'Document uploaded successfully' };
  }

  /**
   * Delete a document for an event
   *
   * @param id - The event ID
   * @param req - The request object
   * @throws UnauthorizedException if the user is not authorized
   * @throws NotFoundException if the event is not found
   * @returns The updated event with document URL, and a success message
   */
  @Delete(':id/document')
  @UseGuards(AuthGuard())
  async deleteDocument(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<{ updatedActivity: Activity; message: string }> {
    if (!id) {
      throw new BadRequestException('No activity ID provided');
    }

    const activity = await this.activityService.getActivityById(id);

    const isAdmin = req.user.role === Role.admin;
    const isCreator =
      req.user.role === Role.creator &&
      activity.createdByUser.toString() === req.user._id;

    if (!isAdmin && !isCreator) {
      throw new UnauthorizedException(
        'You are not authorized to delete a document for this event',
      );
    }

    const updatedActivity = await this.activityService.deleteDocument(id);
    return { updatedActivity, message: 'Document deleted successfully' };
  }
}
