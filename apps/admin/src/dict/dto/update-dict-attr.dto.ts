import { PartialType } from '@nestjs/swagger';
import { CreateDictAttrDto } from './create-dict-attr.dto';

export class UpdateDictAttrDto extends PartialType(CreateDictAttrDto) {}
