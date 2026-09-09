import '../lib/features/account/data/mobile_account.dart';
void check(bool condition, String message) { if (!condition) throw StateError(message); }
void main() {
  final identity = <String,dynamic>{'user': {'displayName':'Test','email':'test@example.com'}, 'membership':{'status':'ACTIVE'}};
  Map<String,dynamic> subscription(int used, int? limit) => {
    'plan':'PRO','status':'ACTIVE','cancelAtPeriodEnd':true,
    'currentPeriodEnd':1790812800000,
    'usage':{'windowEnd':1790812800000,'features':{'AI_INSTANT_ANALYSIS':{'used':used,'limit':limit}}}
  };
  final normal=MobileAccount.fromJson(identity,subscription(4,100));
  check(normal.remaining==96,'Server quota not used');
  check(normal.cancelAtEnd && normal.periodEnd!.isUtc,'Billing period invalid');
  check(MobileAccount.fromJson(identity,subscription(120,100)).remaining==0,'Negative remaining');
  check(MobileAccount.fromJson(identity,subscription(20,null)).remaining==null,'Unlimited lost');
  identity['membership']={'status':'SUSPENDED'};
  check(MobileAccount.fromJson(identity,subscription(0,5)).suspended,'Suspension lost');
  var rejected=false;
  try { MobileAccount.fromJson(identity,subscription(-1,100)); } on FormatException { rejected=true; }
  check(rejected,'Malformed quota accepted');
  print('6 account model checks passed');
}
