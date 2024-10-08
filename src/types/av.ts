import type { FfmpegCommand } from "fluent-ffmpeg";
import type { TmpFile } from "../helper/index.js";

export type AVSetCallback<T> = (av: Buffer, indeX: number) => Promise<T> | T;

/**
 * @link https://ffmpeg.org/ffmpeg-filters.html#Syntax
 */
export type VideoDrawTextOptions =
  | string
  | string[]
  | {
      box?: 1 | 0;
      boxborderw?: string | number;
      boxcolor?: string | number;
      line_spacing?: string | number;
      text_align?: string;
      y_align?: "text" | "baseline" | "font";
      borderw?: string | number;
      bordercolor?: string | number;
      expansion?: "none" | "strftime" | "normal";
      basetime?: string | number;
      fix_bounds?: boolean;
      fontcolor?: string | number;
      fontcolor_expr?: string;
      font?: string;
      fontfile?: string;
      alpha?: number;
      fontsize?: number;
      text_shaping?: number;
      ft_load_flags?:
        | "default"
        | "no_scale"
        | "no_hinting"
        | "render"
        | "no_bitmap"
        | "vertical_layout"
        | "force_autohint"
        | "crop_bitmap"
        | "pedantic"
        | "ignore_global_advance_width"
        | "no_recurse"
        | "ignore_transform"
        | "monochrome"
        | "linear_design"
        | "no_autohint";
      shadowcolor?: string | number;
      boxw?: string | number;
      boxh?: string | number;
      shadowx?: string | number;
      shadowy?: string | number;
      start_number?: number;
      tabsize?: number;
      timecode?: string;
      timecode_rate?: number;
      tc24hmax?: number;
      text?: string;
      textfile?: string;
      text_source?: string;
      reload?: number;
      x?: string | number;
      y?: string | number;
      dar?: string | number;
      hsub?: string | number;
      vsub?: string | number;
      lh?: string | number;
      h?: string | number;
      w?: string | number;
      max_glyph_a?: string | number;
      max_glyph_d?: string | number;
      max_glyph_h?: string | number;
      max_glyph_w?: string | number;
      font_a?: string | number;
      font_d?: string | number;
      top_a?: string | number;
      bottom_d?: string | number;
      n?: number;
      sar?: number;
      t?: number;
      text_h?: number;
      text_w?: number;
      pict_type?: string;
      pkt_pos?: number;
      duration?: number;
      pkt_size?: number;
    };

export type AVCustomCallback<T> = (
  command: FfmpegCommand,
  tmpFile: Omit<TmpFile, "init" | "clean">,
  index: number,
) => Promise<T> | T;

export type AVCallback<T> = (command: FfmpegCommand) => Promise<T> | T;
