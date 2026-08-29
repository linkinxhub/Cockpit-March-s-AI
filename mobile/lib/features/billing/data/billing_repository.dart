import '../../../core/api/api_client.dart';

class BillingEntitlement{
  const BillingEntitlement({required this.plan,required this.status,required this.active,required this.cancelAtPeriodEnd,required this.currentPeriodEnd});
  final String plan;
  final String status;
  final bool active;
  final bool cancelAtPeriodEnd;
  final int? currentPeriodEnd;
  factory BillingEntitlement.fromJson(Map<String,dynamic> json)=>BillingEntitlement(
    plan:(json['plan'] as String?)??'FREE',
    status:(json['status'] as String?)??'free',
    active:json['active']==true,
    cancelAtPeriodEnd:json['cancelAtPeriodEnd']==true,
    currentPeriodEnd:(json['currentPeriodEnd'] as num?)?.toInt(),
  );
  bool get isPro=>plan=='PRO'||plan=='INSTITUTIONAL';
  bool get isInstitutional=>plan=='INSTITUTIONAL';
}

class BillingRepository{
  BillingRepository(this._api);final ApiClient _api;
  Future<BillingEntitlement> load()async=>BillingEntitlement.fromJson(await _api.getJson('/api/billing/status'));
}
