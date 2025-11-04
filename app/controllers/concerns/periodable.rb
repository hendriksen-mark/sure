module Periodable
  extend ActiveSupport::Concern

  included do
    before_action :set_period
  end

  private
    def set_period
      if params[:period] == "custom" && params[:start_date].present? && params[:end_date].present?
        @period = Period.custom(
          start_date: Date.parse(params[:start_date]),
          end_date: Date.parse(params[:end_date])
        )
      else
        @period = Period.from_key(params[:period] || Current.user&.default_period)
      end
    rescue Period::InvalidKeyError, Date::Error
      @period = Period.last_30_days
    end
end
