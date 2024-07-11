<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes" />

    <xsl:key name="personById" match="person" use="id" />
    <xsl:template match="/">

        <div class="tree" id="stammbaum">
            <ul id="whole">
                <li>
                    <!-- Root person and spouse -->
                    <xsl:variable name="rootPerson" select="//person[not(root_person='')]" />
                    <xsl:apply-templates select="$rootPerson[2]" mode="root" />
                    <ul>
                        <xsl:variable name="rootPersonId" select="$rootPerson[1]/id" />
                        <xsl:variable name="rootPersonSpouseId" select="$rootPerson[2]/id" />
                        <xsl:apply-templates
                            select="//person[parent_id_1=$rootPersonId and parent_id_2=$rootPersonSpouseId]"
                            mode="children" />
                    </ul>
                </li>
            </ul>
        </div>

    </xsl:template>

    <xsl:template match="person" mode="root">
        <xsl:apply-templates select="." mode="person" />
        <xsl:apply-templates
            select="key('personById', spouse_id)" mode="spouse" />
    </xsl:template>

    <!-- Normal Child -->
    <xsl:template match="person" mode="person">
        <xsl:variable name="person-id" select="id" />
        <a class="person"
            onclick="openEditPopup({$person-id})"
            onmouseenter="showAddNewMenu(this)" onmouseout="hideAddNewMenu(this)"
            data-id="{$person-id}">
            <!-- Image -->
            <xsl:variable name="image" select="image" />
            <img alt="Person Image" src="{$image}" />
            <!-- First name & Last name -->
            <b class="person-names">
                <xsl:value-of select="first_name" />
                <br />
                <xsl:value-of select="last_name" />
            </b>
            <!-- Birth year & Death year -->
            <b class="person-years">
                <xsl:value-of select="birth_year" />
                <xsl:text> - </xsl:text>
                <xsl:choose>
                    <xsl:when test="death_year != ''">
                        <xsl:value-of select="death_year" />
                    </xsl:when>
                    <xsl:otherwise> heute </xsl:otherwise>
                </xsl:choose>
            </b>
        </a>
        <xsl:if
            test="spouse_id and not(preceding::person/id = spouse_id)">
            <xsl:apply-templates select="key('personById', spouse_id)" mode="spouse" />
        </xsl:if>
    </xsl:template>

    <!-- Spouse -->
    <xsl:template match="person" mode="spouse">
        <xsl:variable name="person-id" select="id" />
        <a onclick="openEditPopup({$person-id})"
            onmouseenter="showAddNewMenu(this)" onmouseout="hideAddNewMenu(this)"
            class="person married"
            data-id="{$person-id}">
            <!-- Image -->
            <xsl:variable name="image" select="image" />
            <img class="spouse" alt="Person Image" src="{$image}" />
            <!-- First name & Last name -->
            <b class="person-names">
                <xsl:value-of select="first_name" />
            </b>
            <b class="person-names">
                <xsl:value-of select="last_name" />
            </b>
            <!-- Birth year & Death year -->
            <b class="person-years">
                <xsl:value-of select="birth_year" />
                <xsl:text> - </xsl:text>
                <xsl:choose>
                    <xsl:when test="death_year != ''">
                        <xsl:value-of select="death_year" />
                    </xsl:when>
                    <xsl:otherwise> heute </xsl:otherwise>
                </xsl:choose>
            </b>
        </a>
    </xsl:template>
    
    <!-- Children -->
    <xsl:template match="person" mode="children">
        <li>
            <xsl:apply-templates select="." mode="person" />
            <xsl:if
                test="count(//person[parent_id_1=current()/id] | //person[parent_id_2=current()/id]) > 0">
                <ul>
                    <xsl:apply-templates
                        select="//person[parent_id_1=current()/id] | //person[parent_id_2=current()/id]"
                        mode="children" />
                </ul>
            </xsl:if>
        </li>
    </xsl:template>
</xsl:stylesheet>