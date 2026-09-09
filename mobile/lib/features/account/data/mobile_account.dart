class MobileAccount {
  const MobileAccount({
    required this.name,
    required this.email,
    required this.plan,
    required this.status,
    required this.suspended,
    required this.used,
    required this.limit,
    required this.resetAt,
    required this.periodEnd,
    required this.cancelAtEnd,
  });
  final String name, email, plan, status;
  final bool suspended, cancelAtEnd;
  final int used;
  final int? limit;
  final DateTime? resetAt, periodEnd;
  int? get remaining => limit == null ? null : (limit! - used).clamp(0, limit!);
  static DateTime? _date(dynamic value) => value is num
      ? DateTime.fromMillisecondsSinceEpoch(value.toInt(), isUtc: true)
      : null;
  factory MobileAccount.fromJson(
    Map<String, dynamic> identity,
    Map<String, dynamic> subscription,
  ) {
    final user = Map<String, dynamic>.from(identity['user'] as Map);
    final membership = Map<String, dynamic>.from(identity['membership'] as Map);
    final usage = Map<String, dynamic>.from(subscription['usage'] as Map);
    final features = Map<String, dynamic>.from(usage['features'] as Map);
    final ai = Map<String, dynamic>.from(
      features['AI_INSTANT_ANALYSIS'] as Map,
    );
    final used = ai['used'];
    final limit = ai['limit'];
    if (used is! num ||
        used < 0 ||
        (limit != null && (limit is! num || limit < 0))) {
      throw const FormatException('Invalid allowance');
    }
    return MobileAccount(
      name: user['displayName'] as String,
      email: user['email'] as String,
      plan: subscription['plan'] as String,
      status: subscription['status'] as String,
      suspended: membership['status'] == 'SUSPENDED',
      used: used.toInt(),
      limit: (limit as num?)?.toInt(),
      resetAt: _date(usage['windowEnd']),
      periodEnd: _date(subscription['currentPeriodEnd']),
      cancelAtEnd: subscription['cancelAtPeriodEnd'] == true,
    );
  }
}

