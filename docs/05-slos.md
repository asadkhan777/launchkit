# Service Level Objectives (SLOs) - LaunchKit.ai API

## Overview

This document defines the Service Level Objectives (SLOs) for the LaunchKit.ai API service. SLOs represent our commitment to users regarding service reliability and performance. Each SLO includes an error budget that defines acceptable failure rates.

## SLO Definitions

### 1. Availability SLO

**Objective**: The API will respond successfully to 99.9% of requests over a 30-day rolling window.

- **Target**: 99.9% success rate
- **Error Budget**: 0.1% (43.2 minutes of downtime per month)
- **Measurement Window**: 30 days (rolling)
- **Success Criteria**: HTTP status codes 200-299 and 400-499 (client errors don't count against availability)
- **Failure Criteria**: HTTP status codes 500-599 and timeouts

**Error Budget Burn Rate Alerting**:
- **Fast Burn**: Alert if error budget will be exhausted in < 2 hours (1% error rate over 5 minutes)
- **Slow Burn**: Alert if error budget will be exhausted in < 6 days (0.1% error rate over 1 hour)

### 2. Latency SLO

**Objective**: 95th percentile response time for `/courses` endpoints should be less than 200ms.

- **Target**: P95 latency < 200ms
- **Error Budget**: 5% of requests can exceed 200ms latency
- **Measurement Window**: 30 days (rolling)
- **Scope**: GET `/courses` and POST `/courses` endpoints
- **Exclusions**: Health check endpoints (`/healthz`, `/livez`, `/readyz`)

**Error Budget Burn Rate Alerting**:
- **Fast Burn**: Alert if > 10% of requests exceed 200ms over 5 minutes
- **Slow Burn**: Alert if > 5% of requests exceed 200ms over 1 hour

## Monitoring Implementation

### Data Collection

All SLO metrics are collected via:

1. **OpenTelemetry Tracing**
   - Automatic instrumentation via Fastify plugin
   - Exports to OTLP endpoint: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`
   - Includes request duration, status codes, and endpoint labels

2. **Application Metrics**
   - Custom metrics for business-specific operations
   - Request counts by endpoint and status code
   - Response time histograms

3. **Health Check Monitoring**
   - External monitoring via Better Stack (or similar)
   - Monitors `/readyz` endpoint every 30 seconds
   - Alerts on consecutive failures

### SLI (Service Level Indicator) Queries

#### Availability SLI
```promql
# Success rate over 30 days
(
  sum(rate(http_requests_total{status_code!~"5.."}[30d])) /
  sum(rate(http_requests_total[30d]))
) * 100
```

#### Latency SLI
```promql
# P95 latency for courses endpoints
histogram_quantile(0.95,
  sum(rate(http_request_duration_seconds_bucket{
    endpoint=~"/courses.*"
  }[30d])) by (le)
)
```

### Error Budget Tracking

Error budgets are calculated as:
```
Error Budget Remaining = SLO Target - Current Performance
Error Budget Burn Rate = (Errors in Period) / (Total Error Budget)
```

#### Availability Error Budget
```promql
# Remaining error budget (%)
max(0, 99.9 - (
  sum(rate(http_requests_total{status_code!~"5.."}[30d])) /
  sum(rate(http_requests_total[30d])) * 100
))
```

#### Latency Error Budget
```promql
# Percentage of requests exceeding 200ms
(
  sum(rate(http_request_duration_seconds_bucket{
    endpoint=~"/courses.*",
    le="0.2"
  }[30d])) /
  sum(rate(http_requests_total{endpoint=~"/courses.*"}[30d]))
) * 100
```

## Alerting Strategy

### Availability Alerts

1. **Critical Alert**: Error budget burn rate > 14.4x (will exhaust budget in 2 hours)
   - **Trigger**: 1% error rate over 5 minutes
   - **Response**: Immediate investigation, consider rolling back recent changes

2. **Warning Alert**: Error budget burn rate > 6x (will exhaust budget in 5 days)
   - **Trigger**: 0.1% error rate over 1 hour
   - **Response**: Investigate within 2 hours, plan remediation

### Latency Alerts

1. **Critical Alert**: P95 latency > 500ms (severely degraded)
   - **Trigger**: P95 > 500ms for 5 minutes
   - **Response**: Immediate investigation, check for performance regressions

2. **Warning Alert**: P95 latency > 200ms for extended period
   - **Trigger**: P95 > 200ms for 15 minutes
   - **Response**: Investigate within 1 hour, identify optimization opportunities

## SLO Review Process

### Weekly Reviews
- Check error budget consumption
- Review alert frequency and accuracy
- Identify trends and patterns in SLI data

### Monthly Reviews
- Assess SLO target appropriateness
- Review error budget allocation
- Plan improvements based on user feedback

### Quarterly Reviews
- Consider new SLOs for additional services
- Update targets based on business requirements
- Review monitoring and alerting effectiveness

## Implementation Roadmap

### Phase 1: Basic Monitoring (Current)
- ✅ OpenTelemetry instrumentation
- ✅ Health check endpoints
- ✅ Basic error tracking with Sentry

### Phase 2: SLO Dashboard (Next)
- [ ] Grafana dashboard for SLI visualization
- [ ] Error budget tracking charts
- [ ] Alert rule configuration

### Phase 3: Advanced SLOs (Future)
- [ ] User-facing latency SLOs (browser performance)
- [ ] Data freshness SLOs (course content updates)
- [ ] Feature-specific availability (course generation, payments)

## References

- [SRE Book - Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Better Stack Monitoring](https://betterstack.com/docs/uptime/)
- [Prometheus Alerting Rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)
