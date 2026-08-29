import 'package:dio/dio.dart';

class ApiClient {
  static String? sessionBearerToken;

  ApiClient({required String baseUrl,String? bearerToken})
      : _dio = Dio(BaseOptions(
          baseUrl: baseUrl,
          connectTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 15),
          headers: {
            'Accept': 'application/json',
            if ((bearerToken ?? sessionBearerToken)?.isNotEmpty == true) 'Authorization': 'Bearer ${bearerToken ?? sessionBearerToken}',
          },
        ));

  final Dio _dio;

  Future<Map<String, dynamic>> getJson(String path) async {
    final response = await _dio.get<Map<String, dynamic>>(path);
    return response.data ?? <String, dynamic>{};
  }

  Future<Map<String,dynamic>> putJson(String path,Map<String,dynamic> body) async {
    final response=await _dio.put<Map<String,dynamic>>(path,data:body);
    return response.data??<String,dynamic>{};
  }

  Future<Map<String,dynamic>> postJson(String path,Map<String,dynamic> body) async {
    final response=await _dio.post<Map<String,dynamic>>(path,data:body);
    return response.data??<String,dynamic>{};
  }

  Future<Map<String,dynamic>> patchJson(String path,Map<String,dynamic> body) async {
    final response=await _dio.patch<Map<String,dynamic>>(path,data:body);
    return response.data??<String,dynamic>{};
  }

  Future<Map<String,dynamic>> deleteJson(String path) async {
    final response=await _dio.delete<Map<String,dynamic>>(path);
    return response.data??<String,dynamic>{};
  }
}
