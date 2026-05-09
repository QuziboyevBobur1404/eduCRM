"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = require("path");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log'],
    });
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), { prefix: '/uploads' });
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: common_1.VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new response_interceptor_1.ResponseInterceptor());
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('EduCRM API')
            .setDescription('Enterprise Education CRM — REST API')
            .setVersion('1.0')
            .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
            .addTag('Auth').addTag('Students').addTag('Teachers')
            .addTag('Groups').addTag('Courses').addTag('Attendance')
            .addTag('Payments').addTag('Exams').addTag('Analytics')
            .addTag('Notifications').addTag('Files').addTag('Audit')
            .addTag('Users').addTag('Settings')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
    }
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 EduCRM API: http://localhost:${port}/api/v1`);
    console.log(`📚 Swagger:    http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map