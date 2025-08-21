import { SWAGGER_UI_CONSTANTS } from './domain/constants/swagger.constants';

export class SwaggerTheme {
  constructor(private readonly applicationUrl: string) {}

  private faviconFilename = 'favicon.svg';
  private topbarIconFilename = 'logo.png';

  private customfavIcon: string = `${this.applicationUrl}/public/swagger/assets/${this.faviconFilename}`;

  private customCss: string = `
  .topbar-wrapper { content:url('${this.applicationUrl}/public/swagger/assets/${this.topbarIconFilename}'); width:242px; height:auto; }
  .topbar-wrapper svg { visibility: hidden; }
  .swagger-ui .topbar { background-color: ${SWAGGER_UI_CONSTANTS.TOPBAR.BACKGROUND_COLOR}; }
  .swagger-ui .opblock.opblock-get { background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.GET.BACKGROUND_COLOR}; border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.GET.BORDER_COLOR}; }
  .swagger-ui .opblock.opblock-get .opblock-summary-method { background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.GET.SUMMARY_COLOR}; }
  .swagger-ui .opblock.opblock-post { background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.POST.BACKGROUND_COLOR}; border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.POST.BORDER_COLOR}; }
  .swagger-ui .opblock.opblock-post .opblock-summary-method { background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.POST.SUMMARY_COLOR}; }
  .swagger-ui .opblock.opblock-delete { background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.DELETE.BACKGROUND_COLOR}; border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.DELETE.BORDER_COLOR}; }
  .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.DELETE.SUMMARY_COLOR}; }
  .swagger-ui .opblock.opblock-patch { background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PATCH.BACKGROUND_COLOR}; border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PATCH.BORDER_COLOR}; }
  .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PATCH.SUMMARY_COLOR}; }
  .swagger-ui .opblock.opblock-put { background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PUT.BACKGROUND_COLOR}; border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PUT.BORDER_COLOR}; }
  .swagger-ui .opblock.opblock-put .opblock-summary-method { background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PUT.SUMMARY_COLOR}; }
  .swagger-ui .btn.authorize { border-color: ${SWAGGER_UI_CONSTANTS.AUTHORIZE.BACKGROUND_COLOR}; color: ${SWAGGER_UI_CONSTANTS.AUTHORIZE.BACKGROUND_COLOR}; }
  .swagger-ui .btn.authorize svg { fill: ${SWAGGER_UI_CONSTANTS.AUTHORIZE.BACKGROUND_COLOR}; } 
  .version-stamp { background-color: ${SWAGGER_UI_CONSTANTS.AUTHORIZE.BACKGROUND_COLOR} !important; }
  .swagger-ui .title { color: ${SWAGGER_UI_CONSTANTS.TOPBAR.BACKGROUND_COLOR}; text-align: center; } 
  .swagger-ui .description { color: ${SWAGGER_UI_CONSTANTS.TOPBAR.BACKGROUND_COLOR}; text-align: center; } 
  .info__contact {text-align: center;}
  `;

  private swaggerOptions = {
    persistAuthorization: true,
  };

  public customOptions = {
    customfavIcon: this.customfavIcon,
    customCss: this.customCss,
    swaggerOptions: this.swaggerOptions,
  };
}
