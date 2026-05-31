class Provider
  module Metadata
    REGISTRY = {
      simplefin:      { region: "US",      kind: "Bank",       maturity: :stable, logo_text: "SF" },
      lunchflow:      { region: "US",      kind: "Bank",       maturity: :stable, logo_text: "LF" },
      enable_banking: { region: "EU",      kind: "Bank",       maturity: :beta,   logo_text: "EB" },
      coinstats:      { region: "Global",  kind: "Crypto",     maturity: :beta,   logo_text: "CS" },
      mercury:        { region: "US",      kind: "Bank",       maturity: :beta,   logo_text: "ME" },
      brex:           { region: "US",      kind: "Bank",       maturity: :beta,   logo_text: "BX" },
      coinbase:       { region: "Global",  kind: "Crypto",     maturity: :beta,   logo_text: "CB" },
      binance:        { region: "Global",  kind: "Crypto",     maturity: :beta,   logo_text: "BI" },
      kraken:         { region: "Global",  kind: "Crypto",     maturity: :beta,   logo_text: "KR" },
      snaptrade:      { region: "US / CA", kind: "Investment", maturity: :beta,   logo_text: "ST" },
      ibkr:           { region: "Global",  kind: "Investment", maturity: :beta,   logo_text: "IB" },
      indexa_capital: { region: "ES",      kind: "Investment", maturity: :alpha,  logo_text: "IC" },
      sophtron:       { region: "US",      kind: "Bank",       maturity: :alpha,  logo_text: "SO" },
      plaid:          { region: "US",      kind: "Bank",       tier: "Paid", maturity: :stable, logo_text: "PL" },
      plaid_eu:       { name: "Plaid EU", region: "EU",        kind: "Bank",       tier: "Paid", maturity: :stable, logo_text: "PL" }
    }.freeze

    REGISTRY_KEYS = REGISTRY.keys.sort.freeze

    def self.logo_hue(provider_key)
      key = provider_key.to_sym
      index = REGISTRY_KEYS.index(key)

      if index
        ((360.0 / REGISTRY_KEYS.size) * index).round
      else
        # Deterministic hue for unknown providers based on key string
        provider_key.to_s.bytes.sum % 360
      end
    end

    def self.for(provider_key)
      meta = REGISTRY[provider_key.to_sym] || { logo_text: provider_key.to_s.first(2).upcase }
      meta.merge(logo_hue: logo_hue(provider_key))
    end
  end
end
