import math

def recommend_best_center(farmer_lat, farmer_lon, centers_list):
    # centers_list format: [{'id': 101, 'name': 'Center A', 'lat': 25.18, 'lon': 73.43, 'queue': 40}]
    results = []
    for c in centers_list:
        # Distance calculation
        dlat, dlon = math.radians(c['lat'] - farmer_lat), math.radians(c['lon'] - farmer_lon)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(farmer_lat)) * math.cos(math.radians(c['lat'])) * math.sin(dlon/2)**2
        dist = 6371.0 * (2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)))
        
        # Recommendation Score
        score = (dist * 0.6) + (c['queue'] * 0.4)
        results.append({'center_name': c['name'], 'distance_km': round(dist, 2), 'queue': c['queue'], 'score': round(score, 2)})
    
    return sorted(results, key=lambda x: x['score'])