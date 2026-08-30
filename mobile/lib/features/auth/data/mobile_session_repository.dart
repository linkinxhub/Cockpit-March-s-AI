import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../core/api/api_client.dart';

class MobileSessionRepository{
  MobileSessionRepository({FlutterSecureStorage? storage}):_storage=storage??const FlutterSecureStorage();
  static const _tokenKey='cockpit_mobile_session_token';
  final FlutterSecureStorage _storage;

  Future<void> saveToken(String token)async=>_storage.write(key:_tokenKey,value:token);
  Future<String?> readToken()async=>_storage.read(key:_tokenKey);
  Future<void> clear()async=>_storage.delete(key:_tokenKey);

  Future<String> claimPairingCode(String baseUrl,String code)async{final api=ApiClient(baseUrl:baseUrl),json=await api.postJson('/api/mobile-pair/claim',{'code':code});final token=json['token']?.toString()??'';if(token.isEmpty)throw Exception(json['error']?.toString()??'pairing_failed');return token;}
  Future<ApiClient> authenticatedClient(String baseUrl)async{final token=await readToken();return ApiClient(baseUrl:baseUrl,bearerToken:token);}
}
