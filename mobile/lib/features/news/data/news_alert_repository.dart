import '../../../core/api/api_client.dart';

class NewsAlertEvent {
  const NewsAlertEvent({required this.id,required this.assetKey,required this.title,required this.publisher,required this.link,required this.publishedAt,required this.severity,required this.reason});
  final String id,assetKey,title,publisher,link,severity,reason;
  final int publishedAt;
  factory NewsAlertEvent.fromJson(Map<String,dynamic> json)=>NewsAlertEvent(
    id:json['id']?.toString()??'',assetKey:json['assetKey']?.toString()??'',title:json['title']?.toString()??'—',publisher:json['publisher']?.toString()??'—',link:json['link']?.toString()??'',publishedAt:(json['publishedAt'] as num?)?.toInt()??0,severity:json['severity']?.toString()??'INFO',reason:json['reason']?.toString()??'',
  );
}

class NewsAlertRepository {
  NewsAlertRepository(this._api);
  final ApiClient _api;
  Future<List<NewsAlertEvent>> fetch({int since=0,String severity='IMPORTANT',List<String>? assets}) async {
    final query=<String>['since=$since','severity=${Uri.encodeQueryComponent(severity)}'];
    if(assets!=null&&assets.isNotEmpty)query.add('assets=${Uri.encodeQueryComponent(assets.join(','))}');
    final json=await _api.getJson('/api/news-alerts?${query.join('&')}');
    final events=json['events'] as List<dynamic>? ?? const [];
    return events.whereType<Map<String,dynamic>>().map(NewsAlertEvent.fromJson).toList(growable:false);
  }
}
