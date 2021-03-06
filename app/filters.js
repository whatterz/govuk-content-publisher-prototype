const moment = require('moment');
// Moment complains about RFC2822/ISO date not being correct
moment.suppressDeprecationWarnings = true;

const numeral = require('numeral');

const TurndownService = require('turndown');

const mimetypes = require('./data/mimetypes.json');
const languages = require('./data/languages.json');
const organisations = require('./data/organisations.json');

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
   let filters = {}

   /* ------------------------------------------------------------------
     date filter for use in Nunjucks
     example: {{ params.date | date("DD/MM/YYYY") }}
     outputs: 01/01/1970
   ------------------------------------------------------------------ */
   filters.date = function(timestamp, format) {
     return moment(timestamp).format(format);
   }

   /* ------------------------------------------------------------------
     dateAdd filter for use in Nunjucks
     example: {{ '1970-01-01' | dateAdd(1, 'weeks') | date("DD/MM/YYYY") }}
     outputs: 08/01/1970
   ------------------------------------------------------------------ */
   filters.dateAdd = function(date, num, unit='days') {
     return moment(date).add(num, unit).toDate();
   }

   /* ------------------------------------------------------------------
     utility date functions
   ------------------------------------------------------------------ */
   filters.govDate = function(timestamp) {
     return moment(timestamp).format('D MMMM YYYY');
   }

   filters.govShortDate = function(timestamp) {
     return moment(timestamp).format('D MMM YYYY');
   }

   filters.govTime = function(timestamp) {
     let t = moment(timestamp);
     if(t.minutes() > 0) {
       return t.format('h:mma');
     } else {
       return t.format('ha');
     }
   }

  /* ------------------------------------------------------------------
   numeral filter for use in Nunjucks
   example: {{ params.number | numeral("0,00.0") }}
   outputs: 1,000.00
  ------------------------------------------------------------------ */
  filters.numeral = function(number, format) {
   return numeral(number).format(format);
  }

  /* ------------------------------------------------------------------
  language filter for use in Nunjucks
  example: {{ "en" | language }}
  outputs: English
  ------------------------------------------------------------------ */
  filters.language = function(code, type = 'english_name') {
   if (!code)
     return null;

   let language = languages.filter( (obj) =>
     obj.code == code
   )[0];

   return language[type];
  }

  /* ------------------------------------------------------------------
  organisationName filter for use in Nunjucks
  example: {{ "af07d5a5-df63-4ddc-9383-6a666845ebe9" | organisationName }}
  outputs: Government Digital Service
  ------------------------------------------------------------------ */
  filters.organisationName = function(code) {
   if (!code)
     return null;

   let organisation = organisations.filter( (obj) =>
     obj.key == code
   )[0];

   return organisation['value'];
  }

  /* ------------------------------------------------------------------
   document type filter for use in Nunjucks
   example: {{ 'news_story' | documentType }}
   outputs: "News story"
  ------------------------------------------------------------------ */
  filters.documentType = function(type) {

    if (!type)
      return type;

    switch (type) {
      case 'articles_correspondence': return 'Articles and correspondence';
      case 'authored_article': return 'Authored article';
      case 'case_study': return 'Case study';
      case 'consultation': return 'Consultation';
      case 'corporate_information': return 'Corporate information';
      case 'corporate_report': return 'Corporate report';
      case 'correspondence': return 'Correspondence';
      case 'decision': return 'Decision';
      case 'detailed_guide': return 'Detailed guide';
      case 'fatality_notice': return 'Fatality notice';
      case 'foi_release': return 'FOI release';
      case 'form': return 'Form';
      case 'guidance': return 'Guidance';
      case 'guidance_regulation': return 'Guidance and regulation';
      case 'impact_assessment': return 'Impact assessment';
      case 'independent_report': return 'Independent report';
      case 'international_treaty': return 'International treaty';
      case 'mainstream_guide': return 'Mainstream guide';
      case 'manual': return 'Manual';
      case 'map': return 'Map';
      case 'national_statistics': return 'National statistics';
      case 'news_communications': return 'News and communications';
      case 'news_story': return 'News story';
      case 'non_statutory_guidance': return 'Non-statutory guidance';
      case 'not_sure': return 'I’m not sure if this should be on GOV.UK';
      case 'notice': return 'Notice';
      case 'official_statistics': return 'Official statistics';
      case 'oral_statement': return 'Oral statement to Parliament';
      case 'policy_consultation': return 'Policy or consultation';
      case 'policy_paper': return 'Policy paper';
      case 'press_release': return 'Press release';
      case 'promotional_material': return 'Promotional material';
      case 'regulation': return 'Regulation';
      case 'research_analysis': return 'Research and analysis';
      case 'specialist_notice': return 'Specialist notice';
      case 'specialist_notices': return 'Specialist notices';
      case 'speech': return 'Speech';
      case 'statement_to_parliament': return 'Statement to Parliament';
      case 'statistics': return 'Statistics';
      case 'statistics_announcement': return 'Statistics announcement';
      case 'statistical_dataset': return 'Statistical dataset';
      case 'statutory_guidance': return 'Statutory guidance';
      case 'transparency_statistics': return 'Transparency, statistics and reports';
      case 'transparency': return 'Transparency';
      case 'written_statement': return 'Written statement to parliament';
      default: return type;
    }

  }


  filters.isPluralDocumentType = function(type) {

    if (!type)
      return false;

    let plural = false;

    const pluralDocumentTypes = ['national_statistics','official_statistics'];

    if (pluralDocumentTypes.indexOf(type) !== -1) {
      plural = true;
    }

    return plural;

  }

  /* ------------------------------------------------------------------
   attachment type filter for use in Nunjucks
   example: {{ 'file' | attachmentType }}
   outputs: "File attachment"
  ------------------------------------------------------------------ */
  filters.attachmentType = function(type) {

    switch (type) {
      case 'file': return 'File attachment';
      case 'external': return 'External link';
      case 'html': return 'HTML attachment';
      default: return type;
    }

  }

  /* ------------------------------------------------------------------
   document status filter for use in Nunjucks
   example: {{ 'submitted_for_review' | documentStatus }}
   outputs: "Submitted for 2i review"
  ------------------------------------------------------------------ */
  filters.documentStatus = function(status) {

    switch (status) {
      case 'draft': return 'Draft';
      case 'submitted_for_review': return 'Submitted for 2i review';
      case 'scheduled': return 'Scheduled to publish';
      case 'published': return 'Published';
      case 'published_but_needs_2i': return 'Published but needs 2i review';
      case 'withdrawn': return 'Withdrawn';
      case 'removed': return 'Removed';
      case 'failed_to_publish': return 'Failed to publish';
      default: return status;
    }

  }

  /* ------------------------------------------------------------------
   strip HTML filter for use in Nunjucks
   example: {{ '<p>Hello world</p>' | stripHtml }}
   outputs: "Hello world"
  ------------------------------------------------------------------ */
  filters.stripHtml = function(html) {
    if (!html)
      return null;

    return html.replace(/<[^>]*>/g,'');
  }

  /* ------------------------------------------------------------------
   absoluteUrl filter for use in Nunjucks
   example: {{ '/browse' | absoluteUrl }}
   outputs: "https://www.gov.uk/browse"
  ------------------------------------------------------------------ */
  filters.absoluteUrl = function(path, domain) {
    if (!path)
      return path;

    if (!domain)
      domain = 'https://www.gov.uk';

    return domain + path;
  }

  /* ------------------------------------------------------------------
   toMarkdown filter for use in Nunjucks
   example: {{ '<h1>Lorem ipsum</h1>' | toMarkdown }}
   outputs: "# Lorem ispum"
  ------------------------------------------------------------------ */
  filters.toMarkdown = function(html) {
    if (!html)
      return html;

    let turndownService = new TurndownService();

    return turndownService.turndown(html);
  }

  /* ------------------------------------------------------------------
   utility functions to determine file size
  ------------------------------------------------------------------ */
  filters.fileSizeFormat = function(input, binary) {
  	let kwargs = getKwargs(arguments);
  	binary = (kwargs.binary !== undefined) ? kwargs.binary : binary;

  	let base = binary ? 1024 : 1000;
  	let bytes = parseFloat(input);
  	let units = [
  		'Bytes',
  		(binary ? 'KiB' : 'KB'),
  		(binary ? 'MiB' : 'MB'),
  		(binary ? 'GiB' : 'GB'),
  		(binary ? 'TiB' : 'TB'),
  		(binary ? 'PiB' : 'PB'),
  		(binary ? 'EiB' : 'EB'),
  		(binary ? 'ZiB' : 'ZB'),
  		(binary ? 'YiB' : 'YB')
  	];

  	if (bytes === 1) {
  		return '1 Byte';
  	} else if (bytes < base) {
  		return bytes + ' Bytes';
  	} else {
  		return units.reduce(function (match, unit, index) {
  			let size = Math.pow(base, index);
  			if (bytes >= size) {
  				return (bytes/size).toFixed(1) + ' ' + unit;
  			}
  			return match;
  		});
  	}
  }

  function getKwargs(args) {
  	let kwargs = [].pop.call(args);
  	return (typeof kwargs === 'object' && kwargs.__keywords) ? kwargs : {};
  }

  /* ------------------------------------------------------------------
    utility functions to determine document content type
  ------------------------------------------------------------------ */
  filters.parseContentType = function(type, attribute = 'abbreviation') {

    if (!type)
      return null;

    let mimetype = mimetypes.filter( (obj) =>
      obj.type == type
    )[0];

    return mimetype[attribute];

  }

  /* ------------------------------------------------------------------
    utility function to slugify text in Nunjucks
    example: {{ "This is some text" | slugify }}
    outputs: this-is-some-text
  ------------------------------------------------------------------ */
  filters.slugify = function(text) {

    if (!text)
      return null;

    return text.toLowerCase()
            .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
            .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
            .replace(/^-+|-+$/g, ''); // remove leading, trailing -

  }

  /* ------------------------------------------------------------------
    utility function to test validity of URL
    example: {{ "http://www.google.com" | isValidUrl }}
    outputs: true
  ------------------------------------------------------------------ */
  filters.isValidUrl = function(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  /* ------------------------------------------------------------------
    utility function to test validity of ISBN
    example: {{ 978-0-596-52068-7 | isValidISBN }}
    outputs: true

    Valid inputs:
      ISBN 978-0-596-52068-7
      ISBN-13: 978-0-596-52068-7
      978 0 596 52068 7
      9780596520687
      ISBN-10 0-596-52068-9
      0-596-52068-9

    From: https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s13.html
  ------------------------------------------------------------------ */
  filters.isValidISBN = function(str) {
    var pattern = new RegExp('/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/','i'); // fragment locator
    return !!pattern.test(str);
  }

  /* ------------------------------------------------------------------
    utility function to return a list from array
    example: {{ ["England","Scotland","Wales"] | arrayToList }}
    outputs: England, Scotland and Wales
  ------------------------------------------------------------------ */
  filters.arrayToList = function(array, join = ', ', final = ' and ') {
    var arr = array.slice(0);

    var last = arr.pop();

    if (array.length > 1) {
      return arr.join(join) + final + last;
    }

    return last;
  }

  /* ------------------------------------------------------------------
    utility function to get an error for a component
    example: {{ errors | getErrorMessage('title') }}
    outputs: "Enter a title"
  ------------------------------------------------------------------ */
  filters.getErrorMessage = function(array, fieldName) {
    if (!array || !fieldName)
      return null;

    let error = array.filter( (obj) =>
      obj.fieldName == fieldName
    )[0];

    return error;
  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
