import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimHtml'
})
export class TrimHtmlPipe implements PipeTransform {

  transform(value: string, args: string): string {

    let trimmedContent: string;
    const contentLimit = parseInt(args, 10);

    trimmedContent = this.trimHtml(value, { limit: contentLimit }).html;
    return trimmedContent;
  }

  // https://github.com/brankosekulic/trimHtml
  trimHtml(html: string, options: any) {

    options = options || {};

    const limit = options.limit || 100,
      preserveTags = (typeof options.preserveTags !== 'undefined') ? options.preserveTags : true,
      wordBreak = (typeof options.wordBreak !== 'undefined') ? options.wordBreak : false,
      suffix = options.suffix || '...',
      moreLink = options.moreLink || '',
      moreText = options.moreText || '»',
      preserveWhiteSpace = options.preserveWhiteSpace || false;

    const arr = html.replace(/</g, '\n<')
      .replace(/>/g, '>\n')
      .replace(/\n\n/g, '\n')
      .replace(/^\n/g, '')
      .replace(/\n$/g, '')
      .split('\n');

    let sum = 0,
      row, cut, add,
      tagMatch,
      tagName,
      more = false;

    const tagStack = [];

    let rowCut = '';

    for (let i = 0; i < arr.length; i++) {

      row = arr[i];

      // count multiple spaces as one character
      if (!preserveWhiteSpace) {
        rowCut = row.replace(/[ ]+/g, ' ');
      } else {
        rowCut = row;
      }

      if (!row.length) {
        continue;
      }

      const charArr = this.getCharArr(rowCut);

      if (row[0] !== '<') {

        if (sum >= limit) {
          row = '';
        } else if ((sum + charArr.length) >= limit) {

          cut = limit - sum;

          if (charArr[cut - 1] === ' ') {
            while (cut) {
              cut -= 1;
              if (charArr[cut - 1] !== ' ') {
                break;
              }
            }
          } else {

            add = charArr.slice(cut).indexOf(' ');

            // break on halh of word
            if (!wordBreak) {
              if (add !== -1) {
                cut += add;
              } else {
                cut = row.length;
              }
            }
          }

          row = charArr.slice(0, cut).join('') + suffix;

          if (moreLink) {
            row += '<a href="' + moreLink + '" style="display:inline">' + moreText + '</a>';
          }

          sum = limit;
          more = true;
        } else {
          sum += charArr.length;
        }
      } else if (!preserveTags) {
        row = '';
      } else if (sum >= limit) {

        tagMatch = row.match(/[a-zA-Z]+/);
        tagName = tagMatch ? tagMatch[0] : '';

        if (tagName) {
          if (row.substring(0, 2) !== '</') {

            tagStack.push(tagName);
            row = '';
          } else {

            while (tagStack[tagStack.length - 1] !== tagName && tagStack.length) {
              tagStack.pop();
            }

            if (tagStack.length) {
              row = '';
            }

            tagStack.pop();
          }
        } else {
          row = '';
        }
      }

      arr[i] = row;
    }

    return {
      html: arr.join('\n').replace(/\n/g, ''),
      more: more
    };
  }

  // count symbols like one char
  getCharArr(rowCut) {

    const charArr = [];
    let subRow: any,
      match: any,
      char: any;

    for (let i = 0; i < rowCut.length; i++) {

      subRow = rowCut.substring(i);
      match = subRow.match(/^&[a-z0-9#]+;/);

      if (match) {
        char = match[0];
        charArr.push(char);
        i += (char.length - 1);
      } else {
        charArr.push(rowCut[i]);
      }
    }

    return charArr;
  }
}
