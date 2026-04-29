const { CampaignModel, CampaignStatusModel, UserModel, CampaignCategoryModel, CategoriesModel, CampaignProposalModel, CampaignInfluencersModel, ProposalStatusModel } = require("../models");
const database = require("../config/db");
const sendEmail = require("../utils/sendEmail");
const CampaignController = () => {
  /**
   * @description Get list of campaigns with status
   * @param req
   * @param res
   * @returns List of campaigns
   */

  const registerCampaign = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const {
      title,
      description,
      budget_min,
      budget_max,
      start_date,
      end_date,
      number_of_influencers,
      status_id,
      category_ids,
    } = req.body;
    if (!title || !description || !status_id) {
      return res.status(400).json({
        success: false,
        message: "Title, description are required.",
      });
    }
    const campaign = await CampaignModel.create({
      brand_id: userId,
      title,
      description,
      budget_min: budget_min || null,
      budget_max: budget_max || null,
      start_date,
      end_date,
      number_of_influencers,
      status_id,
    });
    if (category_ids && category_ids.length > 0) {
      const categoryData = category_ids.map((catId) => ({
        campaign_id: campaign.id,
        category_id: catId,
      }));
      await CampaignCategoryModel.bulkCreate(categoryData);
    }
    const categories = await CategoriesModel.findAll({
      where: {
        id: category_ids,
      },
      attributes: ["id", "name"],
    });
    const campaignWithStatus = await CampaignModel.findByPk(campaign.id, {
      include: [
        {
          model: CampaignStatusModel,
          attributes: ["id", "status_name"],
        },
      ],
    });
    const campaignJson = campaignWithStatus.toJSON();
    const status = campaignJson.campaign_status?.status_name || null;
    delete campaignJson.status_id;
    delete campaignJson.category_id;
    return res.status(201).json({
      success: true,
      message: "Compaign created successful.",
      data: {
        ...campaignJson,
        categories: categories,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 const getCampaigns = async (req, res) => {
  try {
    const userId = req.user.id;
    const campaigns = await CampaignModel.findAll({
      where: {
        brand_id: userId,
      },
      include: [
        {
          model: CampaignStatusModel,
          as: "campaign_status",
          attributes: ["status_name"],
        },
        {
          model: CampaignCategoryModel,
          as: "campaign_categories",
          attributes: ["category_id"],
          include: [
            {
              model: CategoriesModel,
              as: "category",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    const formattedData = campaigns.map((campaign) => {
      const data = campaign.toJSON();
      const status = data.campaign_status?.status_name || null;
      const categories =
        data.campaign_categories?.map((item) => ({
          id: item.category?.id,
          name: item.category?.name,
        })) || [];
      delete data.campaign_status;
      delete data.campaign_categories;
      delete data.status_id;
      delete data.category_id;
      return {
        ...data,
        status,
        categories,
      };
    });
    return res.status(200).json({
      success: true,
      data: formattedData,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  const getCampaignDetails = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const campaign = await CampaignModel.findByPk(id, {
      include: [
        {
          model: CampaignStatusModel,
          attributes: ["status_name"],
        },
        {
          model: CampaignCategoryModel,
          as: "campaign_categories",
          attributes: ["category_id"],
          include: [
            {
              model: CategoriesModel,
              as: "category",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }
    const data = campaign.toJSON();
    const status = data.CampaignStatus?.status_name || null;
    const categories =
      data.campaign_categories?.map((item) => ({
        id: item.category?.id,
        name: item.category?.name,
      })) || [];
    delete data.CampaignStatus;
    delete data.campaign_categories;
    delete data.status_id;
    delete data.category_id;

    return res.status(200).json({
      success: true,
      data: {
        ...data,
        status,
        categories,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const editCampaign = async (req, res) => {
  try {
    const { id } = req.body;
    const {
      title,
      description,
      budget_min,
      budget_max,
      start_date,
      end_date,
      status_id,
      category_ids,
    } = req.body;
    const campaign = await CampaignModel.findByPk(id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }
    await campaign.update({
      title,
      description,
      budget_min: budget_min || null,
      budget_max: budget_max || null,
      start_date,
      end_date,
      status_id,
    });
    if (category_ids) {
      // delete old
      await CampaignCategoryModel.destroy({
        where: { campaign_id: id },
      });

      // insert new
      if (category_ids.length > 0) {
        const categoryData = category_ids.map((catId) => ({
          campaign_id: id,
          category_id: catId,
        }));

        await CampaignCategoryModel.bulkCreate(categoryData);
      }
    }
    const categories = await CategoriesModel.findAll({
      where: { id: category_ids || [] },
      attributes: ["id", "name"],
    });
    const updatedCampaign = await CampaignModel.findByPk(id, {
      include: [
        {
          model: CampaignStatusModel,
          as: "campaign_status",
          attributes: ["status_name"],
        },
      ],
    });
    const data = updatedCampaign.toJSON();
    const status = data.campaign_status?.status_name || null;
    delete data.campaign_status;
    delete data.status_id;
    delete data.category_id;

    return res.status(200).json({
      success: true,
      message: "Campaign updated successfully.",
      data: {
        ...data,
        status,
        categories,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.body;
    const campaign = await CampaignModel.findByPk(id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }
    await CampaignCategoryModel.destroy({
      where: { campaign_id: id },
    });
    await campaign.destroy();
    return res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const saveCampaignPorposal = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const {
      campaign_id,
      brand_id,
      message,
      price,
      delivery_days,
      status_id,
      influencer_ids,
    } = req.body;

    if (!campaign_id || !brand_id || !status_id) {
      return res.status(400).json({
        success: false,
        message: "campaign_id, brand_id and status_id are required.",
      });
    }

    // Create Proposal
    const campaignProposal = await CampaignProposalModel.create({
      brand_id,
      campaign_id,
      message,
      price,
      delivery_days,
      status_id,
    });

    // Save influencers
    if (influencer_ids && influencer_ids.length > 0) {
      const influencerData = influencer_ids.map((id) => ({
        proposal_id: campaignProposal.id,
        influencer_id: id,
      }));

      await CampaignInfluencersModel.bulkCreate(influencerData);
    }

    // Fetch proposal details with influencers
    const proposalDetails = await CampaignProposalModel.findByPk(
      campaignProposal.id,
      {
        include:[
          {
            model: ProposalStatusModel,
            as:"proposal_status",
            attributes:["id","status_name"]
          },
          {
            model: CampaignInfluencersModel,
            as:"campaign_influencers",
            attributes:["id","influencer_id", "is_accepted"],
            include: [
              {
                model: UserModel, // your influencer model name
                as: "influencer", // use your actual alias
                attributes: [
                  "id",
                  "name",
                  "slug",
                  "email",
                  "profile_pic",
                ]
              }
            ]
          }
        ]
      }
    );

    // Fetch updated campaign with status
   const campaignDetails = await CampaignModel.findByPk(campaign_id,{
  include:[
     {
          model: CampaignCategoryModel,
          as: "campaign_categories",
          attributes: ["category_id"],
          include: [
            {
              model: CategoriesModel,
              as: "category",
              attributes: ["id", "name"],
            },
          ],
        },
    {
      model: CampaignStatusModel,
      as:"campaign_status",
      attributes:["id","status_name"]
    }
  ]
});


    // Get influencer users
    const influencers = await UserModel.findAll({
      where: {
        id: influencer_ids
      },
      attributes: ["id", "name", "email","slug","profile_pic"]
    });
    // Get brand/admin user
    const brandUser = await UserModel.findByPk(brand_id, {
      attributes: ["id", "name", "email","profile_pic"]
    });

    const cdata = campaignDetails.toJSON();
    const status = cdata.CampaignStatus?.status_name || null;
    const categories =
      cdata.campaign_categories?.map((item) => ({
        id: item.category?.id,
        name: item.category?.name,
      })) || [];
    const categoryNames = categories.map(c=>c.name).join(", ");
    delete cdata.CampaignStatus;
    delete cdata.campaign_categories;
    delete cdata.status_id;
    delete cdata.category_id;

    // Email to influencers
    for (const influencer of influencers) {
      await sendEmail({
        to: influencer.email,
        subject: "OneHub UAE - New Campaign Proposal Assigned",
        html: `
<!DOCTYPE html>
<html>
<body style="margin:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px;">
<tr>
<td align="center">

<table width="620" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">

<tr>
<td style="background:#c9a227;padding:35px;text-align:center;color:#fff;">
<img src="https://onehub.ae/wp-content/uploads/2023/10/One-Hub-Logo.webp" width="70"/>
<h2 style="margin-top:15px;">New Campaign Proposal Invitation</h2>
<p>You have been shortlisted for a campaign collaboration.</p>
</td>
</tr>

<tr>
<td style="padding:30px;">

<p>Hello <strong>${influencer.name}</strong>,</p>

<p>You have been selected for the following campaign proposal:</p>

<h3 style="border-bottom:1px solid #eee;padding-bottom:8px;">
Campaign Details
</h3>

<table width="100%" style="border-collapse:collapse;">
<tr>
<td style="padding:10px;border:1px solid #ddd;"><b>Campaign Name</b></td>
<td style="padding:10px;border:1px solid #ddd;">${campaignDetails.title}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><b>Category</b></td>
<td style="padding:10px;border:1px solid #ddd;">
${categoryNames}
</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><b>Campaign Descrition</b></td>
<td style="padding:10px;border:1px solid #ddd;">
${campaignDetails.description}
</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><b>Budget</b></td>
<td style="padding:10px;border:1px solid #ddd;">ADE ${campaignDetails.budget_min} - ${campaignDetails.budget_max}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><b>Brand</b></td>
<td style="padding:10px;border:1px solid #ddd;"><img src="${brandUser.profile_pic}" width="50" height="50" style="border-radius:50%;display:block;object-fit:cover;"> ${brandUser.name}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><b>Selected Influencers</b></td>
<td style="padding:10px;border:1px solid #ddd;">
${influencers.length}
</td>
</tr>
</table>


<h3 style="margin-top:30px;border-bottom:1px solid #eee;padding-bottom:8px;">
Proposal Details
</h3>

<table width="100%" style="border-collapse:collapse;">
<tr>
<td style="padding:10px;border:1px solid #ddd;"><b>Proposal Message</b></td>
<td style="padding:10px;border:1px solid #ddd;">${message}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><b>Delivery Days</b></td>
<td style="padding:10px;border:1px solid #ddd;">${delivery_days} Days</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><b>Price</b></td>
<td style="padding:10px;border:1px solid #ddd;">ADE ${price}</td>
</tr>
</table>


<h3 style="margin-top:30px;">
Selected Influencers
</h3>

${influencers.map(i => `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
<tr>
<td width="60">
<img src="${i.profile_pic}"
width="50"
height="50"
style="border-radius:50%;display:block;object-fit:cover;">
</td>

<td style="font-size:14px;">
<strong>${i.name}</strong><br>
<a href="https://onehub.ae/influencer/${i.slug}" style="color:#c9a227;font-size:12px;">
View Profile
</a>
</td>
</tr>
</table>
`).join("")}


<div style="text-align:center;margin:35px 0;">
<a href="https://onehub.ae/influencer/login"
style="background:#c9a227;color:#fff;padding:14px 30px;border-radius:8px;text-decoration:none;">
Review Proposal
</a>
</div>

<p>
Please login to review and respond to this proposal.
</p>

<p style="margin-top:30px;">
Regards,<br>
<strong>OneHub Team</strong>
</p>

</td>
</tr>

<tr>
<td style="background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;">
© 2026 OneHub. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>
</body>
</html>
`
      });
    }

    // Email to admin/brand
    // if (brandUser?.email) {
    //   await sendEmail({
    //     to: brandUser.email,
    //     subject: "Campaign Proposal Created",
    //     html: `
    //       <h3>Hello ${brandUser.name},</h3>
    //       <p>A new campaign proposal has been created successfully.</p>

    //       <p>${proposalInfo.replace(/\n/g,"<br>")}</p>

    //       <p>Selected Influencers:</p>
    //       <ul>
    //         ${influencers.map(i => `<li>${i.name} (${i.email})</li>`).join("")}
    //       </ul>
    //     `
    //   });
    // }
    
    return res.status(201).json({
      success: true,
      message: "Campaign proposal created successfully.",
      data: {
        proposal: proposalDetails,
        campaign: campaignDetails,

      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  return {
    getCampaigns,registerCampaign, getCampaignDetails, editCampaign, deleteCampaign, saveCampaignPorposal
  };
};

module.exports = CampaignController;
