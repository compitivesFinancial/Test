export interface campaign_data {
    user_id?:string,
    tagline:string,
    share_price:string,
    total_valuation:string,
    // min_investment:string,
    // max_investment:string,
    campaign_images:campaign_type[],
    team:team_type[],
    company_bio:string,
    reason_to_invest:string,
    investment_planning:string,
    terms:string,
    introduce_team:string,
    financing_type:string,
    fund_use:string,
    financing_period:string,
    obtain_finance_dt:string,
    finance_repayment_dt:string,
}

interface campaign_type{
    image:string
}

interface team_type{
    name:string,
    designation:string,
    image:string
}
