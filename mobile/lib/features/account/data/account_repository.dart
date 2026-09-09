import '../../../core/api/api_client.dart';
import 'mobile_account.dart';
export 'mobile_account.dart';

class AccountRepository {
  AccountRepository(this.api);
  final ApiClient api;
  Future<MobileAccount> fetch() async {
    final data = await Future.wait([
      api.getJson('/api/me'),
      api.getJson('/api/account/subscription'),
    ]);
    return MobileAccount.fromJson(data[0], data[1]);
  }
}
