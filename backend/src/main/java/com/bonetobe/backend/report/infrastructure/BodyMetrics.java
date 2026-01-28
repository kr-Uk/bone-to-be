package com.bonetobe.backend.report.infrastructure;

public record BodyMetrics(
        Double shoulder_slope_angle,
        Double shoulder_width_index,
        Double hip_width_index,
        Double shoulder_hip_ratio,
        Double upper_body_depth_index,
        Double ribcage_volume_index,
        Double waist_curvature_index,
        Double joint_thickness_index,
        Double arm_torso_ratio,
        Double linearity_index,
        Double leg_length_index
) {

}
